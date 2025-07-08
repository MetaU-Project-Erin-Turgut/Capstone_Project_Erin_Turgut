const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { getUnionOfSets } = require('./Utils');

const updateGroupCentralLocation = (groupCoord, userCoord) => {
   //Given the fact that the accepted group's location and user's location are close by, the midpoint formula is good enough for midpoint calculation:
   const newLongitude = (groupCoord.st_x + userCoord.st_x) / 2;
   const newLatitude = (groupCoord.st_y + userCoord.st_y) / 2;
   return {
        longitude: newLongitude,
        latitude: newLatitude
   }
}


const updateGroupInterests = async (groupInterests, userInterests) => {
    //this method will create a union set between group's existing interests and user's interests
    
    //need to union the expandedGroupInterests set with the user's selected interests set
    const unionInterests = await getUnionOfSets(groupInterests, userInterests);

    return [...unionInterests]; //return as array, not set object
}


module.exports = { updateGroupCentralLocation, updateGroupInterests };