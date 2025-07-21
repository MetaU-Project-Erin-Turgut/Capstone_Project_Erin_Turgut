const express = require('express')
const router = express.Router()

const { PrismaClient, Status } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated')
const { getExpandedInterests, calcJaccardSimilarity, adjustCandidateGroups } = require('../systems/Utils');

//get all first level interests
router.get('/interests', isAuthenticated, async (req, res) => {
    try {
        const parentInterests = await prisma.interest.findMany({
            where: {
                parentId: null, 
            },
            include: { 
                children: true
            }
        })
        res.status(201).json(parentInterests)
    } catch (error) {
        console.error("Error fetching interests:", error)
        res.status(500).json({ error: "Something went wrong while fetching interets." })
    }
})


//get immediate children of clicked on interest
router.get('/interests/:interestId', isAuthenticated, async (req, res) => {
    const interestId = parseInt(req.params.interestId);

    try {
        const interest = await prisma.interest.findUnique({
            where: {
                id: interestId,
            },
            include: { 
                children: true
            }
        });

        if (!interest ) {
            res.status(404).send('This interest does not exist');
        }

        res.status(200).json(interest.children); //only send back children
        


    } catch (error) {
        console.error("Error fetching interest and its children:", error)
        res.status(500).json({ error: "Could not fetch interest and its children." });
    }
})

//get user's selected interests
router.get('/user/interests', isAuthenticated, async(req, res) => {
    try {
        const userInterests = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
            include: { 
                interests: true
            }
        })
        res.status(201).json(userInterests.interests)
    } catch (error) {
        console.error("Error fetching user's interests:", error)
        res.status(500).json({ error: "Something went wrong while fetching user's interests." })
    }
})

//update user interests
router.post('/user/interests', isAuthenticated, async (req, res) => {
    const { chosenInterests } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: req.session.userId,
            },
            data: {
                interests: {
                    set: chosenInterests,
                },
            },
            include: {
                interests: true,
                groups: {where: {status: Status.PENDING}, select: {group: {select: {interests: { select: {interest: { select: {level: true, id: true}}}}, id: true}}}}
            }
        })

        //now that user interests are updated, any previous compatibility ratio for the user's pending groups
        //will be inaccurate. Need to recalculate these:

        //First, need to expand the user's interests:
        const expandedUserInterests = await getExpandedInterests(updatedUser.interests, false);

        const interestIds = expandedUserInterests.map((interest) => {
            return interest.id;
        })

        //Need to make sure the array of groups is just the interests and id:
        const existingGroups = updatedUser.groups.map((group) => {
            return {interests: group.group.interests, id: group.group.id};
        })

        adjustCandidateGroups(existingGroups, interestIds);

        //for each of the user's pending groups, calculate the jaccard similarity to user's interests
        for (let i = 0; i < existingGroups.length; i++) {
            const compatibilityRatio = calcJaccardSimilarity(existingGroups[i], expandedUserInterests.length)

            if (compatibilityRatio > 0) {
                //update new ratio in database
                await prisma.group_User.update({
                    where: {
                        userId_groupId: {
                            groupId: existingGroups[i].id,
                            userId: req.session.userId
                        }
                    },
                    data: {
                        compatibilityRatio: {
                            set: compatibilityRatio.toFixed(2),
                        },
                    },
                })
            } else {//if new compatibility ratio is 0, don't show to user anymore. i.e. delete the relation
                await prisma.group_User.delete({
                    where: {
                        userId_groupId: {
                            groupId: existingGroups[i].id,
                            userId: req.session.userId
                        }
                    }
                })
            }
            
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in updating interests:", error)
        res.status(500).json({ error: "Could not update interests." });
    }
})


module.exports = router
