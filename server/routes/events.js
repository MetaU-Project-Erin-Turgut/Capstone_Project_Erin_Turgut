const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated')

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
    const {updatedStatus} = req.body; 

    try {
        const isEvent_user = await prisma.event_User.count({
            where: {
                user_id: req.session.userId,
                event_id: event_id
            }
        });

        if (isEvent_user === 0 ) {
            res.status(404).json({error: 'This user - event relationship does not exist'});
        }

        const updatedEvent = await prisma.event_User.update({
            where: {
                user_id_event_id: {
                    user_id: req.session.userId,
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