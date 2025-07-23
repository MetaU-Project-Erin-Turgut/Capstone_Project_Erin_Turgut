const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const LOCATION_SEARCH_RADIUS = 5000; //in meters

//enums for user's status for an event or group
const Status = Object.freeze({
    NONE: "NONE", //used for when no filter is applied
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    DROPPED: "DROPPED"
});

//enums for event type
const EventType = Object.freeze({
    JUSTMEET: 0,
    ENTERTAINMENT: 1,
    EATING: 2,
    ACTIVE: 3,
    NUMTYPES: 4 //specifies number of different event types
});



const getUserCoordinates = async (userId) => {
    const userCoord = await prisma.$queryRaw`
    SELECT ST_X(coord::geometry), ST_Y(coord::geometry)
    FROM "User" 
    WHERE id = ${userId}`;

    return {
        longitude: userCoord.at(0).st_x,
        latitude: userCoord.at(0).st_y,
    };
}

const getExpandedInterests = async (originalInterests, isGroup) => {
    let expandedInterestSet = [];

    for (const interest of originalInterests) {
        let currInterest = interest;
        if (isGroup) currInterest = interest.interest;

        if (currInterest.parentId == null) {
            expandedInterestSet.push(currInterest);
            continue;
        }
        //query for interest ancestry path for each original interest
        const path = await prisma.interest.findUnique({
            where: { id: currInterest.id },
            select: {
                path: true
            }
        })

        //use path field to avoid recursive calls to get entire hierarchy 
        const pathParsed = path.path.split('.').map((id) => {
            return parseInt(id);
        })

        pathParsed.pop(); //don't need to include original interest again

        //get the actual interest objects of these ancestor ids
        const ancestorInterests = await prisma.interest.findMany({
            where: { id: { in: pathParsed } }
        })

        expandedInterestSet = [currInterest, ...expandedInterestSet, ...ancestorInterests]; //expand user's interest set to now include ancestor interests
    }
    return expandedInterestSet;
}

const getUnionOfSets = (groupInterests, userInterests) => {
    const groupIds = groupInterests.map((group) => {
        return group.interest.id;
    })
    const interestIds = userInterests.map((interest) => {
        return interest.id;
    })

    const groupInterestsSet = new Set(groupIds);
    return groupInterestsSet.union(new Set(interestIds));
}

const adjustCandidateGroups = (groupCandidates, interestIds) => {
    //for each group, need total for all interests and their weightings - used later in jaccard similarity calculation (will filter interests below so need to get this info now)
    for (let i = 0; i < groupCandidates.length; i++) {
        let allInterestsWeighted = 0;
        for (let j = 0; j < groupCandidates[i].interests.length; j++) {
            allInterestsWeighted += groupCandidates[i].interests[j].interest.level;
        }
        groupCandidates[i] = { ...groupCandidates[i], totalWeight: allInterestsWeighted } //add as attribute to group object
    }

    //additionally filter group interest list only by user's interests
    for (group of groupCandidates) {
        group.interests = group.interests.filter((interest) => {
            return interestIds.includes(interest.interest.id);
        });
    }
}

const calcJaccardSimilarity = (group, numUserInterests) => {
    let numerator = 0; //cardinality of intersection between group interest set and user interest set
    for (groupInterest of group.interests) {
        numerator += groupInterest.interest.level; //add up matching interests and their weightings
    }
    const denominator = (numUserInterests + group.totalWeight) - numerator; //cardinality of union between group interest set and user interest set

    return numerator / denominator;
}

const filterMembersByStatus = (members, status) => {
    return members.filter((member) => {
        return member.status === status;
    })
}

const filterGroupsByLocation = async (eventCoordinates, forEventSearch) => {
    //returns groups within radius 

    if (forEventSearch) { //do not need to exclude full groups for event search
        return await prisma.$queryRaw`SELECT id, title FROM "Group" WHERE ST_DWithin(coord, ST_SetSRID(ST_MakePoint(${eventCoordinates.longitude}, ${eventCoordinates.latitude}), 4326)::geography, ${LOCATION_SEARCH_RADIUS})`;
    }

    //if it is for group search for users to join, we do need to exclude full groups
    return await prisma.$queryRaw`SELECT id, title FROM "Group" WHERE ST_DWithin(coord, ST_SetSRID(ST_MakePoint(${eventCoordinates.longitude}, ${eventCoordinates.latitude}), 4326)::geography, ${LOCATION_SEARCH_RADIUS}) AND "isFull"= FALSE`;

}

const getOtherGroupMembers = async (userId) => {
    const groups = await prisma.group_User.findMany({
        where: { userId: userId, status: Status.ACCEPTED },
        select: { group: { include: { members: { where: { NOT: { userId: userId } }, include: { user: true } } } } },
    })

    let groupMates = new Map(); //key is user id and value is number of times they were found in one of the current user's groups

    for (group of groups) {
        //note: the nested loops below are limited by a group's max member limit so it shouldn't be a complexity concern
        const members = filterMembersByStatus(group.group.members, Status.ACCEPTED);
        for (member of members) {
            groupMates.set(member.user.id, groupMates.has(member.user.id) ? groupMates.get(member.user.id) + 1 : 1)
        }
    }

    return groupMates;
}

const createEvent_User = async (userId, eventId) => {
    const eventUser = await prisma.event_User.findUnique({
        where: {
            userId_eventId: {
                eventId: eventId,
                userId: userId
            }
        }
    })
    if (!eventUser) {
        return await prisma.event_User.create({
            data: {
                user: { connect: { id: userId } },
                event: { connect: { id: eventId } },
                status: Status.PENDING
            }
        })
    }
    return await prisma.event_User.update({
        where: {
            userId_eventId: {
                eventId: eventId,
                userId: userId
            }
        },
        data: {
            status: Status.PENDING
        }
    })


}

//borda count implementation
const adjustGroupEventTypeTotals = (user, group, isDrop) => {
    //order user's event type preferences based on tallies:

    let talliesMap = new Map()//key is tally number and values are count of number of event type (indices) in user eventTypeTallies with that tally. - this is necessary for duplicate handling later in this function

    const sortableArr = user.eventTypeTallies.map((eventTypeTally, index) => {
        if (talliesMap.has(eventTypeTally)) {
            talliesMap.set(eventTypeTally, talliesMap.get(eventTypeTally) + 1)
        } else {
            talliesMap.set(eventTypeTally, 1)
        }
       
        return { tally: eventTypeTally, eventType: index }
    })

    sortableArr.sort((a, b) => b.tally - a.tally);

    let newGroupEventTypeTotals = []

    //get copy of group's eventTypeTotals array
    if (group.eventTypeTotals.length === 0) {
        newGroupEventTypeTotals = new Array(EventType.NUMTYPES).fill(0);
    } else {
        newGroupEventTypeTotals = [...group.eventTypeTotals]
    }

    //Need to combine user's event type array orderings (sortableArr version) with existing group array. 
    let currLevel = EventType.NUMTYPES; //addition will occur based on how high an event type is ranked for current user. Highest = number of event types and lowest = 1
    //start with user's highest ranked event type and add/subtract the corresponding ranking to the event type index in group array

    //NOTE: the below for loop and the ones within it cannot be any larger than the number of event types, so there isn't a complexity concern here
    for (let i = 0; i < sortableArr.length; i++) {
        if (talliesMap.get(sortableArr[i].tally) > 1) { 
            //duplicate encountered, the next following talliesMap.get(sortableArr[i].tally) number of items should be the same duplicates
            let newCurrLevel = currLevel;

            //for duplicates, add all the currLevel values they would be if they weren't duplicates and divide by how many duplicates there are
            const numDuplicates = talliesMap.get(sortableArr[i].tally);
            for (let j = 1; j < numDuplicates; j++) {
                newCurrLevel += (currLevel - j)
            }
            newCurrLevel /= numDuplicates;

            for(let j = 0; j < numDuplicates; j++) {
                newGroupEventTypeTotals[sortableArr[i + j].eventType] = newGroupEventTypeTotals[sortableArr[i + j].eventType] + (isDrop ? -(newCurrLevel) : newCurrLevel); 
            }
            i += (numDuplicates - 1);
            currLevel -= numDuplicates;
            continue;
        }
        newGroupEventTypeTotals[sortableArr[i].eventType] = newGroupEventTypeTotals[sortableArr[i].eventType] + (isDrop ? -(currLevel) : currLevel); 
        currLevel--;
    }

    return newGroupEventTypeTotals;
}

const adjustPendingUserCompatibilities = async (groupId, updatedGroup) => {
    //Now that group data has been updated, need to update the compatibility ratios for all the pending users for that group:
    const pendingUsersFetched = await prisma.group_User.findMany({
        where: {
            groupId: groupId,
            status: Status.PENDING
        },
        select: { user: { include: { interests: true } } }
    })

    //Need to make sure the array of users is just the interests and id:
    const pendingUsers = pendingUsersFetched.map((user) => {
        return { interests: user.user.interests, id: user.user.id };
    })


    for (let i = 0; i < pendingUsers.length; i++) {
        //First, need to expand the user's interests:
        const expandedUserInterests = await getExpandedInterests(pendingUsers[i].interests, false);

        const interestIds = expandedUserInterests.map((interest) => {
            return interest.id;
        })

        const groupAsArr = [];
        groupAsArr.push(updatedGroup)

        adjustCandidateGroups(groupAsArr, interestIds);

        updatedGroup = groupAsArr.at(0);

        const compatibilityRatio = calcJaccardSimilarity(updatedGroup, expandedUserInterests.length)

        if (compatibilityRatio > 0) {
            //update new ratio in database
            await prisma.group_User.update({
                where: {
                    userId_groupId: {
                        groupId: groupId,
                        userId: pendingUsers[i].id
                    }
                },
                data: {
                    compatibilityRatio: {
                        set: compatibilityRatio.toFixed(2),
                    },
                },
            })
        } else {//if new compatibility ratio is 0, don't show to user anymore. i.e. delete the relation
            await prisma.group_User.delete({
                where: {
                    userId_groupId: {
                        groupId: groupId,
                        userId: pendingUsers[i].id
                    }
                }
            })
        }
    }
}


module.exports = { Status, EventType, getUserCoordinates, getExpandedInterests, getUnionOfSets, filterMembersByStatus, filterGroupsByLocation, getOtherGroupMembers, createEvent_User, adjustCandidateGroups, calcJaccardSimilarity, adjustPendingUserCompatibilities, adjustGroupEventTypeTotals };