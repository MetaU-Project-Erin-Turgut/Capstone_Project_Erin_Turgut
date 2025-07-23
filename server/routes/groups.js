const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const { isAuthenticated } = require('../middleware/CheckAutheticated')
const { findGroups } = require('../systems/GroupFindAlgo');
const { updateGroupCentralLocation, updateGroupInterests, recalculateGroupCentralLocation, recalculateGroupInterests, sendExistingEventsToUser } = require('../systems/GroupUpdateMethods')
const { Status, filterMembersByStatus, getUserCoordinates, adjustPendingUserCompatibilities, EventType, adjustGroupEventTypeTotals } = require('../systems/Utils');

const FULL_GROUP_SIZE = 15;

//get user's groups 
router.get('/user/groups/', isAuthenticated, async (req, res) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
            include: {
                groups: { include: { group: { include: { interests: { include: { interest: true } }, members: { where: { NOT: { userId: req.session.userId } }, include: { user: true } } } } } }
            }
        })
        res.status(201).json(userData.groups)
    } catch (error) {
        console.error("Error fetching groups:", error)
        res.status(500).json({ error: "Something went wrong while fetching groups." })
    }
})

//get new group suggestions - will be called immediately after user updates their interests
router.get('/user/groups/new', isAuthenticated, async (req, res) => {
    try {
        const updatedUser = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { id: true, username: true, interests: true }
        });
        //Call GroupFindAlgo, will return all suggested groups sorted by compatibility
        let suggestedGroups = await findGroups(updatedUser); //NOTE: the interests attribute part of the returned objects won't be entirely accurate - not needed for now though
        
        let isNewGroup = false;
        //if no matching groups were found, create new group with just the user
        if (suggestedGroups.length === 0) {
            isNewGroup = true;

            const userCoords = await getUserCoordinates(req.session.userId);

            const newTitle = updatedUser.username + "'s group";
            const newDesc = updatedUser.username + "'s newly created group";
            const newGroupRecordId = await prisma.$queryRaw`INSERT INTO "Group" (title, description, "isFull", coord) VALUES(${newTitle}, ${newDesc}, false, ST_SetSRID(ST_MakePoint(${userCoords.longitude}, ${userCoords.latitude}), 4326)::geography) RETURNING id`;

            //include interests for the newly created group
            const newGroup = await prisma.group.update({
                where: {
                    id: newGroupRecordId.at(0).id
                },
                data: {
                    interests: {
                        create: updatedUser.interests.map((interest) => {
                            return { interest: { connect: interest } }
                        })
                    },
                    eventTypeTotals: new Array(EventType.NUMTYPES).fill(0)
                },
                include: {
                    interests: { include: { interest: true } }, members: { where: { NOT: { userId: req.session.userId } }, include: { user: true } }
                }

            })

            suggestedGroups.push({ ...newGroup, compatibilityRatio: 1 });
        }
        //update the user_group table with these invites
        for (group of suggestedGroups) {

            const isGroup_user = await prisma.group_User.findUnique({
                where: {
                    userId_groupId: {
                        groupId: group.id,
                        userId: req.session.userId
                    }
                }
            });

            //only create if group_user relationship doesn't already exist
            if (!isGroup_user) {
                await prisma.group_User.create({
                    data: {
                        group: { connect: { id: group.id } },
                        user: { connect: { id: req.session.userId } },
                        status: isNewGroup ? Status.ACCEPTED : Status.PENDING, //if there were no groups and a new group was created for the user, they should automatically be accepted/part of the group
                        compatibilityRatio: group.compatibilityRatio
                    }
                })
            }

        }

        res.status(201).json(suggestedGroups)
    } catch (error) {
        console.error("Error fetching groups:", error)
        res.status(500).json({ error: "Something went wrong while fetching groups." })
    }
})

//accept group - first, the endpoint above will be called, then this endpoint will be called
//update user's status for a group
router.put(`/user/groups/:groupId/${Status.ACCEPTED}`, isAuthenticated, async (req, res) => {
    const groupId = parseInt(req.params.groupId);


    try {
        //get group and user relationship and each of their coordinates
        const group_user = await prisma.group_User.findUnique({
            where: {
                userId_groupId: {
                    groupId: groupId,
                    userId: req.session.userId
                }
            },
            include: {
                group: { include: { interests: { select: { interest: true } }, members: true } },
                user: { include: { interests: true } }
            }
        });
        const userCoord = await prisma.$queryRaw`
        SELECT ST_X(coord::geometry), ST_Y(coord::geometry)
        FROM "User" 
        WHERE id = ${req.session.userId}`;
        const groupCoord = await prisma.$queryRaw`
        SELECT ST_X(coord::geometry), ST_Y(coord::geometry)
        FROM "Group" 
        WHERE id = ${groupId}`;

        if (!group_user) {
            res.status(404).json({ error: 'This user - group relationship does not exist' });
        }

        //now that user accepted this group, we need to update the group's interest list and central location

        const newGroupCoords = updateGroupCentralLocation(groupCoord.at(0), userCoord.at(0));
        const newGroupInterests = await updateGroupInterests(group_user.group.interests, group_user.user.interests);

        const acceptedMembers = filterMembersByStatus(group_user.group.members, Status.ACCEPTED);
        let newIsFullStatus = false;

        if (acceptedMembers.length + 1 >= FULL_GROUP_SIZE) {
            newIsFullStatus = true;
        }
        const newGroupEventTypeTotals = adjustGroupEventTypeTotals(group_user.user, group_user.group, false); //pass false because user is not dropping the group

        //update group in database (update if is now full, update coordinates, update interests list)
        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: {
                interests: {
                    deleteMany: {},
                    create: newGroupInterests.map((interest) => {
                        return { interest: { connect: { id: interest } } }
                    })
                },
                isFull: newIsFullStatus,
                eventTypeTotals: newGroupEventTypeTotals
            },
        })

        //update group coordinates
        await prisma.$queryRaw`
        UPDATE "Group" 
        SET "coord" = (ST_SetSRID(ST_MakePoint(${newGroupCoords.st_x}, ${newGroupCoords.st_y}), 4326)::geography)
        WHERE id=${groupId}`;


        //update status of group_user relationship
        const updatedGroupUser = await prisma.group_User.update({
            where: {
                userId_groupId: {
                    groupId: groupId,
                    userId: req.session.userId
                }
            },
            data: {
                status: Status.ACCEPTED
            },
            include: { group: { include: { interests: { include: { interest: true } }, members: { where: { NOT: { userId: req.session.userId } }, include: { user: true } }, events: true } } }
        })

        const originalUpdatedGroupUser = updatedGroupUser; //this will be modified later, so keep the updated version to return to user at the end

        //if group is now full, remove it as a "Pending" option from users' lists who have not accepted the group
        if (newIsFullStatus) {
            await prisma.group.update({
                where: {
                    id: groupId
                },
                data: {
                    members: {
                        deleteMany: {
                            status: Status.PENDING,
                        },
                    }
                }
            });
        }

        //make sure new accepted member also receives existing event invites
        const eventIds = updatedGroupUser.group.events.map((eventGroup) => {
            return eventGroup.eventId;
        })

        await sendExistingEventsToUser(eventIds, req.session.userId);

        //Now that group data has been updated, need to update the compatibility ratios for all the pending users for that group:
        await adjustPendingUserCompatibilities(groupId, updatedGroupUser.group)


        res.status(200).json(originalUpdatedGroupUser);


    } catch (error) {
        console.error("Error joining group:", error)
        res.status(500).json({ error: "Could not join this group at this time." });
    }
})

//ignore group invite - status: "REJECTED"
router.put(`/user/groups/:groupId/${Status.REJECTED}`, isAuthenticated, async (req, res) => {
    const groupId = parseInt(req.params.groupId);

    try {
        const isGroup_user = await prisma.group_User.findUnique({
            where: {
                userId_groupId: {
                    groupId: groupId,
                    userId: req.session.userId
                }
            }
        });

        if (!isGroup_user) {
            res.status(404).json({ error: 'This user - group relationship does not exist' });
        }

        const updatedGroupUser = await prisma.group_User.update({
            where: {
                userId_groupId: {
                    groupId: groupId,
                    userId: req.session.userId
                }
            },
            data: {
                status: Status.REJECTED
            },
            include: { group: { include: { interests: { include: { interest: true } }, members: { where: { NOT: { userId: req.session.userId } }, include: { user: true } }, events: true } } }
        })

        res.status(200).json(updatedGroupUser);

    } catch (error) {
        console.error("Error rejecting group invite:", error)
        res.status(500).json({ error: "Could not reject invite to this group at this time." });
    }
})

//drop group - status: "DROPPED"
router.put(`/user/groups/:groupId/${Status.DROPPED}`, isAuthenticated, async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    try {
        //get group and user relationship
        const group_user = await prisma.group_User.findUnique({
            where: {
                userId_groupId: {
                    groupId: groupId,
                    userId: req.session.userId
                }
            },
            include: {
                group: { include: { interests: { select: { interest: true } }, members: { where: { NOT: { userId: req.session.userId } }, include: { user: { include: { interests: true } } } } } },
                user: { include: { interests: true } }
            }
        });

        if (!group_user) {
            res.status(404).json({ error: 'This user - group relationship does not exist' });
        }

        //filter to only users that actually accepted the group
        const acceptedMembers = filterMembersByStatus(group_user.group.members, Status.ACCEPTED);

        let updatedGroupUser = null; //what will be returned in res.json - need to keep outside of if/else

        let originalUpdatedGroupUser = null;

        //if group is now empty with removal of this user, remove the group
        if (acceptedMembers.length === 0) { //remember, user is already excluded for list from db query - so should check against 0
            //delete all group_user many to many relations
            await prisma.group_User.deleteMany({
                where: { groupId: groupId }
            })
            //delete all group_event many to many relations
            await prisma.group_Event.deleteMany({
                where: { groupId: groupId }
            })
            //delete all group_interest many to many relations
            await prisma.group_Interest.deleteMany({
                where: { groupId: groupId }
            })
            //delete group
            await prisma.group.delete({
                where: { id: groupId }
            })
        } else {
            //recalculate group's central location

            const memberIds = acceptedMembers.map((member) => {
                return member.userId
            })

            const memberCoords = await prisma.$queryRaw`
            SELECT ST_X(coord::geometry), ST_Y(coord::geometry)
            FROM "User" 
            WHERE id = ANY(${(memberIds)})`;

            const newGroupCoords = await recalculateGroupCentralLocation(memberCoords);

            //remove user's interests from overall group interests

            const newGroupInterests = await recalculateGroupInterests(acceptedMembers, group_user.group.interests);

            //we also need to adjust the group eventTypeTotals array with this new user deletion:
            const newGroupEventTypeTotals = adjustGroupEventTypeTotals(group_user.user, group_user.group, true); //pass true because user is dropping the group

            //update group in database (update coordinates, update interests list)
            const updatedGroup = await prisma.group.update({
                where: { id: groupId },
                data: {
                    interests: {
                        deleteMany: {},
                        create: newGroupInterests.map((interest) => {
                            return { interest: { connect: { id: interest.id } } }
                        })
                    },
                    eventTypeTotals: newGroupEventTypeTotals
                },
            })

            //update group coordinates
            await prisma.$queryRaw`
            UPDATE "Group" 
            SET "coord" = (ST_SetSRID(ST_MakePoint(${newGroupCoords.st_x}, ${newGroupCoords.st_y}), 4326)::geography)
            WHERE id=${groupId}`;

            //update status of group_user relationship
            updatedGroupUser = await prisma.group_User.update({
                where: {
                    userId_groupId: {
                        groupId: groupId,
                        userId: req.session.userId
                    }
                },
                data: {
                    status: Status.DROPPED
                },
                include: { group: { include: { interests: { include: { interest: true } }, members: { where: { NOT: { userId: req.session.userId } }, include: { user: true } } } } }
            })

            originalUpdatedGroupUser = updatedGroupUser; //this will be modified later, so keep the updated version to return to user at the end

            //Now that group data has been updated, need to update the compatibility ratios for all the pending users for that group:
            await adjustPendingUserCompatibilities(groupId, updatedGroupUser.group)

        }
        res.status(200).json(originalUpdatedGroupUser ? { ...originalUpdatedGroupUser, isGroupDeleted: false } : { isGroupDeleted: true });

    } catch (error) {
        console.error("Error dropping group:", error)
        res.status(500).json({ error: "Could not update your response to dropping this group at this time." });
    }
})


module.exports = router