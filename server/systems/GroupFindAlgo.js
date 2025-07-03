const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const LOCATION_SEARCH_RADIUS = 100; //in meters

const findGroups = async (userData) => {

    filterGroupsByLocation(userData.latitude, userData.longitude);

}

const filterGroupsByLocation = async (userLatitude, userLongitude) => {
    //returns groups within radius AND ones that are not full

    const groupRecord = await prisma.$queryRaw`SELECT id, title, ST_AsText(coord) FROM "Group" WHERE ST_DWithin(coord, ST_SetSRID(ST_MakePoint(${userLongitude}, ${userLatitude}), 4326)::geography, ${LOCATION_SEARCH_RADIUS}) AND is_full= FALSE`;
    
    console.log("Groups near User:")
    console.log(groupRecord);
}

module.exports = { findGroups };

