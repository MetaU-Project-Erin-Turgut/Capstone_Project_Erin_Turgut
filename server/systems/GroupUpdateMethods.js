const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { getUnionOfSets } = require('./Utils');

const updateGroupCentralLocation = (groupCoord, userCoord) => {
   //Given the fact that the accepted group's location and user's location are close by, the midpoint formula is good enough for midpoint calculation:
   const newLongitude = (groupCoord.st_x + userCoord.st_x) / 2;
   const newLatitude = (groupCoord.st_y + userCoord.st_y) / 2;
   return {
        st_x: newLongitude,
        st_y: newLatitude
   }
}

const updateGroupInterests = async (groupInterests, userInterests) => {
    //this method will create a union set between group's existing interests and user's interests
    
    //need to union the expandedGroupInterests set with the user's selected interests set
    const unionInterests = await getUnionOfSets(groupInterests, userInterests);

    return [...unionInterests]; //return as array, not set object
}

const recalculateGroupCentralLocation = async (memberCoords) => {
    let currGroupCoord = memberCoords.at(0)
    for(let i = 1; i < memberCoords.length; i++) {
        currGroupCoord = updateGroupCentralLocation(currGroupCoord, members[i].coord)
    }
    return currGroupCoord;
}

const recalculateGroupInterests = async (members, groupInterests) => {
    //go through all members' interests (not including current user trying to drop out) and create a set of interest ids
    const interestsToKeep = new Set();

    for (member of members) {
        for (interest of member.user.interests) {
            interestsToKeep.add(interest.id)
        }
    }
            
    let newGroupInterests = [];
    //for all group interests, check map if it exists. If not, remove the interest
    for (interest of groupInterests) {
        if (interestsToKeep.has(interest.interest.id)) {
            newGroupInterests.push(interest);
        }
    }

    return newGroupInterests;
}


module.exports = { updateGroupCentralLocation, updateGroupInterests, recalculateGroupCentralLocation, recalculateGroupInterests };