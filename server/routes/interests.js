const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { findGroups } = require('../systems/GroupFindAlgo');

// Middleware to check if user is logged in before being able to perform any crud operations
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "You must be logged in to perform this action." })
    }
    next()
}

//get all first level interests
router.get('/interests', isAuthenticated, async (req, res) => {
    try {
        const parentInterests = await prisma.interest.findMany({
            where: {
                parent_id: null, 
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

        res.status(200).json(interest);
        


    } catch (error) {
        console.error("Error fetching interest and its children:", error)
        res.status(500).json({ error: "Could not fetch interest and its children." });
    }
})

//choose an interest
router.post('/interests/:interestId', isAuthenticated, async (req, res) => {
    const interestId = parseInt(req.params.interestId);

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: req.session.userId,
            },
            data: {
                interest_id: interestId
            },
            include: {
                interest: {
                    include: {parent: true}
                }
            }
        })

        //Call first step of GroupFindAlgo - should make this a separate call from frontend later

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error choosing this interest:", error)
        res.status(500).json({ error: "Could not choose this interest." });
    }
})

module.exports = router
