const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const KDBush = require('kdbush');
const geokdbush = require('geokdbush');

const MAX_GROUPS_TO_RECOMMEND = 5;
const LOCATION_SEARCH_RADIUS = 1; //in km

const findGroups = async (userData) => {

    let currInterest = userData.interest
    let groups = []; //this will hold all the groups that will be recommended to the user in order of most compatible to least compatible
    let tempGroups = [];
    while (groups.length <= MAX_GROUPS_TO_RECOMMEND) {
        //Step 1: given user’s selected interest, start there in the interest tree and filter groups that have the same core interest 
        // (also filter by only incomplete groups here). 
        tempGroups = await getAllGroupsByInterestId(currInterest.id); //filters down to only incomplete groups with certain interest

        //Step 2: given the groups that were already filtered down from the last step, now only include groups within a specified radius of the user
        filterGroupsByLocation(tempGroups, userData.latitude, userData.longitude);

        //Step 3: We now have available groups with the same interest as the user and are in their area. Now sort these groups by 
        // averaged event type preference that aligns with the user.


        groups = [...groups, ...tempGroups]; //add newly found groups to whole list

        if (currInterest.parent_id === null) {
            //if we have reached the root of the interest tree, break out of loop
            break;
        }
        currInterest = await getParentInterestObj(currInterest.parent_id) //Keep going uo the interest tree to search for more groups
        tempGroups = [];
    }


    console.log("Your groups!", groups);
    //Edge case: what if you have gone all the way up and no groups were found??
    return groups; 
}


const getAllGroupsByInterestId = async (interestId) => {

    const groups = await prisma.group.findMany( {
        where: {
            interest_id: interestId,
            is_full: false
        }
    });


    return groups;
}


const getParentInterestObj = async (parentId) => {
    const interest = await prisma.interest.findUnique( {
        where: {
            id: parentId,
        }
    });
    return interest;
}

const filterGroupsByLocation = (initialGroups, userLatitude, userLongitude) => {
    //returns groups within radius
    const points = initialGroups.map((group) => {
        return {
            groupId: group.id,
            lon: group.longitude,
            lat: group.latitude,
        }
    })
    const index = new KDBush.default(points.length);
    for (const {lon, lat} of points) index.add(lon, lat);
    index.finish();

    const nearestIds = geokdbush.around(index, userLongitude, userLatitude, Infinity, LOCATION_SEARCH_RADIUS); //return as many points that are 1 km away

    const nearest = nearestIds.map(id => points[id]);

    console.log("Coordinates near User:")
    console.log(nearest);
}

module.exports = { findGroups };

