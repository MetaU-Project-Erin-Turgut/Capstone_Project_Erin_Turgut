const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated');
const { ServerSideCache } = require('../systems/ServerSideUserResultsCache');
const { getOtherGroupMembers } = require('../systems/Utils');

const serverSideCache = new ServerSideCache();

//user search endpoint
router.get('/search/users', isAuthenticated, async (req, res) => {

    const { searchQuery } = req.query;

    /*note: usernames should be one word, so if the search query had a space, that means the user is searching for a first and last name. If there is a second keyword, search by matching
        first AND last name, else just search for first word match with either username, firstname, or lastname */
    const keywords = searchQuery.split(" ");
    const firstWord = keywords.at(0);
    let lastWord = null
    if (keywords.length > 1) {
        lastWord = keywords.at(1)
    }

    try {
        const highLevelResults = serverSideCache.checkUserSpecificCache(searchQuery, req.session.userId);
        const lowerLevelResults = serverSideCache.checkGlobalUserCache(searchQuery);
        //---Step 1: check higher level cache---//
        if (highLevelResults) { //cache hit
            res.status(201).json(highLevelResults); 

        //---Step 2: check lower level cache---//
        } else if (lowerLevelResults) { //cache hit
            //See step 5 below (move filtered lowerLevelResults data to higher level cache and return this to user)
            const closestUsers = await makeUserSpecificEntry(lowerLevelResults, searchQuery, req.session.userId);

            //if the users from lower level cache for this searchQuery have no relation to current user, nothing new will be stored in user-specific cache, so just return result from lower level cache
            if (closestUsers === null) {
                res.status(201).json(lowerLevelResults);
            } else {
                //return these prioritzed and specialized results to the user
                res.status(201).json(closestUsers);
            }

        //---Step 3: cache miss, so load from database---//
        } else {
            //find users with username, firstname, and/or last name that start with the search query passed from the frontend (make filter case insensitive)
            //note: learned about usage of spread operator for conditional where clause in prisma from here: https://stackoverflow.com/questions/72197774/how-to-call-where-clause-conditionally-prisma
            const userResults = await prisma.user.findMany({
                where: {
                        ...( lastWord ? {
                                AND: [
                                    { userProfile: { firstName: { startsWith: firstWord, mode: 'insensitive' } } },
                                    { userProfile: { lastName: { startsWith: lastWord, mode: 'insensitive' } } },
                                ]
                            }
                            : 
                            {
                                OR: [
                                    { username: { startsWith: firstWord, mode: 'insensitive' } },
                                    { userProfile: { firstName: { startsWith: firstWord, mode: 'insensitive' } } },
                                    { userProfile: { lastName: { startsWith: firstWord, mode: 'insensitive' } } },
                                ]
                            }
                        )
                    },
                    select: { username: true, id: true }
            })

            //---Step 4: store in lower level cache---//
            serverSideCache.insertGlobalUserCache(searchQuery, userResults);

            //---Step 5: store only users in same groups in higher level cache and sort by highest amount of shared groups---//
            const closestUsers = await makeUserSpecificEntry(userResults, searchQuery, req.session.userId); 

            //if the users from lower level cache for this searchQuery have no relation to current user, nothing new will be stored in user-specific cache, so just return result from lower level cache
            if (closestUsers === null) {
                res.status(201).json(userResults);
            } else {
                //return these prioritzed and specialized results to the user
                res.status(201).json(closestUsers);
            }
            
        }

    } catch (error) {
        console.error("Error fetching user results:", error)
        res.status(500).json({ error: "Something went wrong while searching for users." })
    }
})

const makeUserSpecificEntry = async (userResults, searchQuery, userId) => {
    const groupMatesMap = await getOtherGroupMembers(userId);

    //filter userResults based on ones that are in current user's groups
    const closestUsers = []
    for (user of userResults) {
        if (groupMatesMap.has(user.id)) {
            closestUsers.push({...user, numMutualGroups: groupMatesMap.get(user.id)})
        }
    }

    if (closestUsers.length === 0) return null;
    
    //sort based on users with most amount of matching groups
    closestUsers.sort((a, b) => b.numMutualGroups - a.numMutualGroups)

    //store this in higher level cache
    serverSideCache.insertUserSpecificCache(searchQuery, closestUsers, userId);

    return closestUsers;
}


module.exports = router
