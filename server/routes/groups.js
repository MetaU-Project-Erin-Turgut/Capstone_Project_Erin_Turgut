const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const { isAuthenticated } = require('../middleware/CheckAutheticated')
const { findGroups } = require('../systems/GroupFindAlgo');
const { updateGroupCentralLocation, updateGroupInterests } = require('../systems/GroupUpdateMethods')
const { Status, filterMembersByStatus } = require('../systems/Utils');

const FULL_GROUP_SIZE = 3;

//get user's groups 
router.get('/user/groups/', isAuthenticated, async (req, res) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: req.session.userId, 
            },
            include: { 
                groups: {include: {group: { include: {interests: true, members: true}}}}
            }
        })
        res.status(201).json(userData.groups)
    } catch (error) {
        console.error("Error fetching groups:", error)
        res.status(500).json({ error: "Something went wrong while fetching groups." })
    }
})

//update user's status for a group
router.patch('/user/groups/:groupId/status', isAuthenticated, async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const {updatedStatus} = req.body; 

    try {
        const isGroup_user = await prisma.group_User.findUnique({
            where: {
                user_id_group_id: {
                    group_id: groupId,
                    user_id: req.session.userId
                }
            }
        });

        if (!isGroup_user) {
            res.status(404).json({error: 'This user - group relationship does not exist'});
        }

        const updatedGroup = await prisma.group_User.update({
            where: {
                user_id_group_id: {
                    group_id: groupId,
                    user_id: req.session.userId
                }
            },
            data: {
                status: updatedStatus
            }
        })

        res.status(200).json(updatedGroup);

    } catch (error) {
        console.error("Error updating group:", error)
        res.status(500).json({ error: "Could not update your response to this group." });
    }
})

//get new group suggestions - will be called immediately after user updates their interests
router.get('/user/groups/new', isAuthenticated, async (req, res) => {
    

    try {
        const updatedUser = await prisma.user.findUnique({
                where: {id: req.session.userId},
                select: {id: true, interests: true}
        });;
        //Call GroupFindAlgo, will return all suggested groups sorted by compatibility
        const suggestedGroups = await findGroups(updatedUser); //NOTE: the interests attribute part of the returned objects won't be entirely accurate - not needed for now though
        
        //update the user_group table with these invites
        for (group of suggestedGroups) {

            const isGroup_user = await prisma.group_User.findUnique({
                where: {
                    user_id_group_id: {
                        group_id: group.id,
                        user_id: req.session.userId
                    }
                }
            });

            //only create if group_user relationship doesn't already exist
            if (!isGroup_user) {
                await prisma.group_User.create({
                    data: {
                        group: {connect: {id: group.id} },
                        user: {connect: {id: req.session.userId} },
                        status: Status.PENDING 
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
router.put('/user/groups/:groupId/accept', isAuthenticated, async (req, res) => {
   const groupId = parseInt(req.params.groupId);


   try {
        //get group and user relationship and each of their coordinates
       const group_user = await prisma.group_User.findUnique({
           where: {
               user_id_group_id: {
                   group_id: groupId,
                   user_id: req.session.userId
               }
           },
           include: {
               group: { include: {interests: {select: {interest: true}}, members: true}},
               user: { include: {interests: true} }
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
           res.status(404).json({error: 'This user - group relationship does not exist'});
       }

       //now that user accepted this group, we need to update the group's interest list and central location

       const newGroupCoords = updateGroupCentralLocation(groupCoord.at(0), userCoord.at(0));
       const newGroupInterests = await updateGroupInterests(group_user.group.interests, group_user.user.interests);

       const acceptedMembers = filterMembersByStatus(group_user.group.members, Status.ACCEPTED);
       let newIsFullStatus = false;

       if (acceptedMembers.length + 1 >= FULL_GROUP_SIZE) {
            newIsFullStatus = true;
       }
       
       //update group in database (update if is now full, update coordinates, update interests list)
       const updatedGroup = await prisma.group.update({
            where: {id: groupId},
            data: {
                 interests: {
                    deleteMany: {},
                    create: newGroupInterests.map((interest) => {
                        return { interest: { connect: {id: interest} } }
                    })
                 },
                 is_full: newIsFullStatus
             },
       })

       //update group coordinates
       await prisma.$queryRaw`
       UPDATE "Group" 
       SET "coord" = (ST_SetSRID(ST_MakePoint(${newGroupCoords.longitude}, ${newGroupCoords.latitude}), 4326)::geography)
       WHERE id=${groupId}`;


       //update status of group_user relationship
       const updatedGroupUser = await prisma.group_User.update({
           where: {
               user_id_group_id: {
                   group_id: groupId,
                   user_id: req.session.userId
               }
           },
           data: {
               status: Status.ACCEPTED 
           }
       })

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


       res.status(200).json(updatedGroup);


   } catch (error) {
       console.error("Error updating group:", error)
       res.status(500).json({ error: "Could not update your response to this group." });
   }
})

module.exports = router