const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { getExpandedInterests } = require('./Utils');

const LOCATION_SEARCH_RADIUS = 100; //in meters - will likely put in utils file later because will be used in event finding algo

const findGroups = async (userData) => {

    const userCoordinates = await getUserCoordinates(userData.id);

    //filter all groups to only include ones within accessible distance to user - and ones that aren't full
    const groupsByLocation = await filterGroupsByLocation(userCoordinates); 

    //expand user's selected interest list to include ancestor interests, so that these are also considered in group matching
    const expandedUserInterests = await getExpandedInterests(userData.interests, false);

    //get all groups that have at least one matching interest and are near the user
    const candidateGroups = await getCandidateGroups(groupsByLocation, expandedUserInterests);
    
    //for each of the possible groups, calculate the jaccard similarity to user's interests
    for (let i = 0; i < candidateGroups.length; i++) {
        const compatibilityRatio = calcJaccardSimilarity(candidateGroups[i], expandedUserInterests.length);
        candidateGroups[i] = {...candidateGroups[i], compatibilityRatio: compatibilityRatio}
    }

    //sort groups by most compatible to least compatible
    candidateGroups.sort((a, b) => b.compatibilityRatio - a.compatibilityRatio );

    //return these group suggestions to the user - limit the number sent?
    return candidateGroups;        
}

const calcJaccardSimilarity = (group, numUserInterests) => {
    let numerator = 0; //cardinality of intersection between group interest set and user interest set
    for (groupInterest of group.interests) {
        numerator += groupInterest.interest.level; //add up matching interests and their weightings
    }
    const denominator = (numUserInterests + group.totalWeight) - numerator; //cardinality of union between group interest set and user interest set

    return numerator/denominator;
}

const getCandidateGroups =  async (allGroupsNearby, allUserInterests) => {

    const groupIds = allGroupsNearby.map((group) => {
        return group.id;
    })
    const interestIds = allUserInterests.map((interest) => {
        return interest.id;
    })
    
    //get group candidates, filtered by ones nearby and ones that include at least one of the user's extended interests
    let groupCandidates =  await prisma.group.findMany({
        where: {
            id: { in: groupIds },
            interests: {
                some: {
                    interest_id: {in: interestIds}
                }
            },
        },
        include: { 
            interests: {
                 select: {interest: { select: {level: true, id: true}}}
            }
        } 
    });

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

    return groupCandidates;
    
}


const getUserCoordinates = async (userId) => {
    const userCoord = await prisma.$queryRaw`
    SELECT ST_X(coord::geometry), ST_Y(coord::geometry)
    FROM "User" 
    WHERE id = ${userId}`;
    
    return {
        longitude: userCoord[0].st_x,
        latitude: userCoord[0].st_y,
    };
}

//this will be used in events finding algo as well, so I will likely move this method to a utils file
const filterGroupsByLocation = async (userCoordinates) => {
    //returns groups within radius AND ones that are not full

    return await prisma.$queryRaw`SELECT id FROM "Group" WHERE ST_DWithin(coord, ST_SetSRID(ST_MakePoint(${userCoordinates.longitude}, ${userCoordinates.latitude}), 4326)::geography, ${LOCATION_SEARCH_RADIUS}) AND is_full= FALSE`;
    
}

module.exports = { findGroups };

