const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

// Middleware to check if user is logged in before being able to perform any crud operations
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "You must be logged in to perform this action." })
    }
    next()
}

//get user's events
router.get('/user/events/', isAuthenticated, async (req, res) => {
    try {
        const userData = await prisma.user.findMany({
            where: {
                id: req.session.userId, //retrieve all events of the logged in user
            },
            include: { 
                events: { 
                    include: { event: true } 
                } 
            }
        })
        res.status(201).json(userData)
    } catch (error) {
        console.error("Error fetching events:", error)
        res.status(500).json({ error: "Something went wrong while fetching events." })
    }
})


module.exports = router