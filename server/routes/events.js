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

//get user's events - possibly change url in future to be more specific?
router.get('/user/events/', isAuthenticated, async (req, res) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: req.session.userId, 
            },
            include: { 
                events: { 
                    //retrieve all events of the logged in user
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

//update user's status for an event
router.patch('/user/events/:event_id', async (req, res) => {
    const event_id = parseInt(req.params.event_id);
    const {user_id, updatedStatus} = req.body; //wasn't sure if user_id should be a path parameter because it may be sensitive information

    try {
        const event = await prisma.event_User.findUnique({
            where: {
                user_id_event_id: {
                    user_id: user_id,
                    event_id: event_id
                }
            }
        });

        if (!event) {
            res.status(404).send('This user - event relationship does not exist');
        }

        const updatedEvent = await prisma.event_User.update({
            where: {
                user_id_event_id: {
                    user_id: user_id,
                    event_id: event_id
                }
            },
            data: {
                status: updatedStatus
            }
        })

        res.status(200).json(updatedEvent);

    } catch (error) {
        console.error("Error fetching events:", error)
        res.status(500).json({ error: "Could not update your response to this event." });
    }
})


module.exports = router