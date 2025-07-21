const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { getExpandedInterests, getUserCoordinates, filterGroupsByLocation, calcJaccardSimilarity, adjustCandidateGroups } = require('./Utils');

const findGroups = async (userData) => {

    const userCoordinates = await getUserCoordinates(userData.id);

    //filter all groups to only include ones within accessible distance to user - and ones that aren't full
    const groupsByLocation = await filterGroupsByLocation(userCoordinates, false); //pass 'false' to clarify this is not an event search (see method definition)

    //expand user's selected interest list to include ancestor interests, so that these are also considered in group matching
    const expandedUserInterests = await getExpandedInterests(userData.interests, false);

    //get all groups that have at least one matching interest and are near the user
    const candidateGroups = await getCandidateGroups(groupsByLocation, expandedUserInterests);
    
    //for each of the possible groups, calculate the jaccard similarity to user's interests
    for (let i = 0; i < candidateGroups.length; i++) {
        const compatibilityRatio = calcJaccardSimilarity(candidateGroups[i], expandedUserInterests.length)
        candidateGroups[i] = {...candidateGroups[i], compatibilityRatio: compatibilityRatio.toFixed(2)}
    }

    //sort groups by most compatible to least compatible
    candidateGroups.sort((a, b) => b.compatibilityRatio - a.compatibilityRatio );

    //return these group suggestions to the user - limit the number sent?
    return candidateGroups;        
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
                    interestId: {in: interestIds}
                }
            },
        },
        include: { 
            interests: {
                 select: {interest: { select: {level: true, id: true}}}
            }
        } 
    });

    adjustCandidateGroups(groupCandidates, interestIds);

    return groupCandidates;
    
}

module.exports = { findGroups };

