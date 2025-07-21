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
            where: {id: currInterest.id},
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
            where: {id: { in: pathParsed}}
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
        for(let j = 0; j < groupCandidates[i].interests.length; j++) {
            allInterestsWeighted += groupCandidates[i].interests[j].interest.level;
        }
        groupCandidates[i] = {...groupCandidates[i], totalWeight: allInterestsWeighted} //add as attribute to group object
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

    return numerator/denominator;
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
        where: {userId: userId, status: Status.ACCEPTED},
        select: { group: { include: { members: { where: { NOT: { userId: userId } }, include: {user: true}} } } },
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
    return await prisma.event_User.create({ 
        data: {
            user: { connect: { id: userId } },
            event: { connect: { id: eventId } },
            status: Status.PENDING 
        }
    })
}


module.exports = { Status, getUserCoordinates, getExpandedInterests, getUnionOfSets, filterMembersByStatus, filterGroupsByLocation, getOtherGroupMembers, createEvent_User, adjustCandidateGroups, calcJaccardSimilarity };