const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated');
const { ServerSideCache } = require('../systems/ServerSideUserResultsCache');
const { getOtherGroupMembers } = require('../systems/Utils');

const serverSideCache = new ServerSideCache();

const NUM_RESULTS_PER_CALL = 5; //TODO: change to higher number after testing

router.get('/search/users/typeahead', isAuthenticated, async (req, res) => {
    const allUserSpecificSearches = serverSideCache.getUserSpecificCacheByUserId(req.session.userId);
    const recentAndLikelyQueries = allUserSpecificSearches.map((searchEntry) => {
        return searchEntry.at(0).slice(1);
    })
    res.status(201).json(recentAndLikelyQueries);
})

//user search endpoint
router.post('/search/users', isAuthenticated, async (req, res) => {

    const { searchQuery, pageMarker } = req.query;
    const { userInterests } = req.body;

    //Need tallies when initial search query happens (even if query data is already in cache)
    const userInterestMap = new Map();
    if (userInterests.length > 0) {
        for (userInterestId of userInterests) {
            userInterestMap.set(userInterestId, 0);
        }
    }
   
    const pageIndex = parseInt(pageMarker.charAt(2));

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
        if (pageMarker === 'HL0' && highLevelResults) { //cache hit

            if (userInterests.length > 0) {
                for (let i = 0; i < lowerLevelResults.length; i++) {
                    //for all interests for each user, if it is one of the keys in user interest inverted index, add to tally
                    for (interest of lowerLevelResults[i].interests) {
                        if (userInterestMap.has(interest)) {
                            userInterestMap.set(interest, userInterestMap.get(interest) + 1)
                        }
                    }
                }
            }
           
            res.status(201).json({ results: highLevelResults, newPageMarker: 'LL0' , userInterestMap: userInterests.length > 0 ? [...userInterestMap.entries()] : null});

        //---Step 2: check lower level cache---//
        } else if (lowerLevelResults) { //cache hit
            if (userInterests.length > 0) {
                for (let i = 0; i < lowerLevelResults.length; i++) {
                    //for all interests for each user, if it is one of the keys in user interest inverted index, add to tally
                    for (interest of lowerLevelResults[i].interests) {
                        if (userInterestMap.has(interest)) {
                            userInterestMap.set(interest, userInterestMap.get(interest) + 1)
                        }
                    }
                }
            }

            const returnedLowerLevelData = await getLowerLevelData(lowerLevelResults, req.session.userId, searchQuery, pageMarker, pageIndex, (userInterests.length > 0 ? userInterestMap : null));
            res.status(201).json(returnedLowerLevelData);

        //---Step 3: cache miss, so load from database---//
        } else {
            //find users with username, firstname, and/or last name that start with the search query passed from the frontend (make filter case insensitive)
            //note: learned about usage of spread operator for conditional where clause in prisma from here: https://stackoverflow.com/questions/72197774/how-to-call-where-clause-conditionally-prisma
            const userResults = await prisma.user.findMany({
                where: {
                    ...(lastWord ? {
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
                select: { username: true, id: true, interests: { select: { id: true } } }
            })

            //make sure interests are stored as just an array of interest ids - not an array of objects like {id: 1}. This will make filtering on frontend easier later
            for (let i = 0; i < userResults.length; i++) {
                //for all interests for each user, if it is one of the keys in user interest inverted index, add to tally
                let refactoredInterestList = [];
                for (interest of userResults[i].interests) {
                    if (userInterestMap.has(interest.id)) {
                        userInterestMap.set(interest.id, userInterestMap.get(interest.id) + 1)
                    }
                    refactoredInterestList.push(interest.id)
                }
                userResults[i].interests = refactoredInterestList;
            }

            //---Step 4: store in lower level cache---//
            serverSideCache.insertGlobalUserCache(searchQuery, userResults);

            const returnedLowerLevelData = await getLowerLevelData(userResults, req.session.userId, searchQuery, pageMarker, pageIndex, (userInterests.length > 0 ? userInterestMap : null));
            res.status(201).json(returnedLowerLevelData);

        }

    } catch (error) {
        console.error("Error fetching user results:", error)
        res.status(500).json({ error: "Something went wrong while searching for users." })
    }
})

/*This function gets next section of data from lower cache if page marker starts with 'L'.
If starts with 'H', it triggers makeUserSpecificEntry to get filtered data into HL cache and returns that if exists (else, just returns lower level cache first set of items)*/
const getLowerLevelData = async (lowerLevelResults, userId, searchQuery, pageMarker, pageIndex, userInterestMap) => {
    const sentUserInterestMap = (userInterestMap == undefined || userInterestMap == null)? null : [...userInterestMap.entries()]
    if (pageMarker.startsWith('L')) {
        if ((lowerLevelResults.length > pageIndex) && (lowerLevelResults.length > pageIndex + NUM_RESULTS_PER_CALL)) { //ensure index increment is still within array size
            return { results: lowerLevelResults.slice(pageIndex, pageIndex + NUM_RESULTS_PER_CALL), newPageMarker: `LL${pageIndex + NUM_RESULTS_PER_CALL}`, userInterestMap: sentUserInterestMap};
        } else {
            return { results: lowerLevelResults.slice(pageIndex), newPageMarker: 'END', userInterestMap: sentUserInterestMap }; //send back end of list notification 
        }

    } else {
        //See below (move filtered lowerLevelResults data to higher level cache and return this to user)
        const closestUsers = await makeUserSpecificEntry(lowerLevelResults, searchQuery, userId);

        //if the users from lower level cache for this searchQuery have no relation to current user, nothing new will be stored in user-specific cache, so just return result from lower level cache
        if (closestUsers === null) {
            if (lowerLevelResults.length > NUM_RESULTS_PER_CALL) {
                return { results: lowerLevelResults.slice(0, NUM_RESULTS_PER_CALL), newPageMarker: `LL${NUM_RESULTS_PER_CALL}`, userInterestMap: sentUserInterestMap };
            } else {
                return { results: lowerLevelResults, newPageMarker: 'END', userInterestMap: sentUserInterestMap };
            }
        } else {
            //return these prioritzed and specialized results to the user
            return { results: closestUsers, newPageMarker: 'LL0', userInterestMap: sentUserInterestMap}; //send back LL0
        }
    }
}

//This function filters and stores users from lower level cache results that are in a group with current user into the higher level cache
const makeUserSpecificEntry = async (userResults, searchQuery, userId) => {
    const groupMatesMap = await getOtherGroupMembers(userId);

    //filter userResults based on ones that are in current user's groups
    const closestUsers = []
    for (user of userResults) {
        if (groupMatesMap.has(user.id)) {
            closestUsers.push({ ...user, numMutualGroups: groupMatesMap.get(user.id) })
        }
    }

    if (closestUsers.length === 0) {
        //no value to insert into user-specific cache, but need to store the userId+searchQuery key so that we know this search was made
        serverSideCache.insertUserSpecificCache(searchQuery, null, userId)
        return null;
    }

    //sort based on users with most amount of matching groups
    closestUsers.sort((a, b) => b.numMutualGroups - a.numMutualGroups)

    //store this in higher level cache
    serverSideCache.insertUserSpecificCache(searchQuery, closestUsers, userId);

    return closestUsers;
}


module.exports = router
