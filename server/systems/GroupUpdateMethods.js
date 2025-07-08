const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { getExpandedInterests } = require('./Utils');

const updateGroupCentralLocation = (groupCoord, userCoord) => {
   //Given the fact that the accepted group's location and user's location are close by, the midpoint formula is good enough for midpoint calculation:
   const newLongitude = (groupCoord.st_x + userCoord.st_x) / 2;
   const newLatitude = (groupCoord.st_y + userCoord.st_y) / 2;
   return {
        longitude: newLongitude,
        latitude: newLatitude
   }
}


const updateGroupInterests = async (groupInterests, user) => {
    //this method will create a union set between group's existing interests and user's interests
    
    //1) need to extend group's interest set to make sure duplicates aren't included later on
    const expandedGroupInterests = await getExpandedInterests(groupInterests, true);

}


module.exports = { updateGroupCentralLocation, updateGroupInterests };