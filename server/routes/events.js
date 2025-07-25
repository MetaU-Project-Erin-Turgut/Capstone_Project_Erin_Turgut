const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated');
const { scheduleEventsForGroups } = require('../systems/EventFindAlgo');
const { Status, EventType, adjustGroupEventTypeTotals } = require('../systems/Utils');

//get user's events 
router.get('/user/events/', isAuthenticated, async (req, res) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: req.session.userId, 
            },
            include: { 
                events: { 
                    //retrieve all events of the logged in user
                    include: { 
                        event: {
                            include: {
                                attendees:{
                                    where: {NOT: {userId: req.session.userId}},
                                    include: {
                                        user: {include: {groups: true}}
                                    },
                                },
                                interest: true, 
                                //filter the groups included by only the ones user is associated with and has accepted
                                groups:{
                                    where: {
                                        group: {
                                            is: {
                                                members: {
                                                    some: {
                                                        AND: [
                                                            {userId: req.session.userId}, 
                                                            {status: Status.ACCEPTED}
                                                        ]   
                                                    }
                                                }
                                            }, 
                                        }
                                    },
                                }
                            }
                        }
                    } 
                } 
            }
        })
        res.status(201).json(userData)
    } catch (error) {
        console.error("Error fetching events:", error)
        res.status(500).json({ error: "Something went wrong while fetching events." })
    }
})

//get user eventTypeTallies
router.get('/user/tallies', isAuthenticated, async (req, res) => {
    try {
        const eventTypeTallies = await prisma.user.findUnique({
            where: {
                id: req.session.userId, 
            },
            select: {eventTypeTallies: true}
        })
        res.status(201).json(eventTypeTallies);
    } catch (error) {
        console.error("Error fetching user event type tallies:", error)
        res.status(500).json({ error: "Something went wrong while fetching user event type tallies." })
    }
})

//update user's status for an event
router.patch('/user/events/:eventId/status', isAuthenticated, async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const {updatedStatus} = req.body; 

    try {
        const event_user = await prisma.event_User.findUnique({
                where: {
                    userId_eventId: {
                        userId: req.session.userId,
                        eventId: eventId
                    }
                },
                include: {user: {select: {eventTypeTallies: true}}, event: {select: {eventType: true}}}
        });

        if (!event_user) {
            res.status(404).json({error: 'This user - event relationship does not exist'});
        }

        //Determine how to change tally by how the user's status for the event changed:
        const changeBy = updatedStatus === Status.ACCEPTED ? 1 : -1

        //Based on this event type, change tally in user's eventTypeTallies array at corresponding index.
        let newEventTypeTallies = []
        if (event_user.user.eventTypeTallies.length === 0) {
            newEventTypeTallies = new Array(EventType.NUMTYPES).fill(0);
        } else {
            newEventTypeTallies = [...event_user.user.eventTypeTallies];
        }

        const originalEventTypeTallies = [...newEventTypeTallies];


        //calculate updated user eventTypeTallies
        newEventTypeTallies[event_user.event.eventType] = newEventTypeTallies[event_user.event.eventType] + changeBy;


        /*User's event type preference may have changed, so for every group the user is a part of (ACCEPTED), 
        drop the user's original eventTypeTallies array and add the new version*/
        const groups = await prisma.group_User.findMany({
                where: {
                    userId: req.session.userId,
                    status: Status.ACCEPTED
                },
                include: {group: true}
        });

        for (let i = 0; i < groups.length; i++) {
            const groupRemovedUserEventTypes = adjustGroupEventTypeTotals({eventTypeTallies: originalEventTypeTallies}, groups[i].group, true);
            const groupUpdatedUserEventTypes = adjustGroupEventTypeTotals({eventTypeTallies: newEventTypeTallies}, {eventTypeTotals: groupRemovedUserEventTypes}, false)

            await prisma.group.update({
                where: {id: groups[i].group.id},
                data: {
                    eventTypeTotals: groupUpdatedUserEventTypes
                }
            })
        
        }

        //update user's eventTypeTallies array in db
        const updatedUser = await prisma.user.update({
            where: {id: req.session.userId},
            data: {
                eventTypeTallies: newEventTypeTallies
            }
        })

        //update event_user relationship status in db
        const updatedEvent = await prisma.event_User.update({
            where: {
                userId_eventId: {
                    userId: req.session.userId,
                    eventId: eventId
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

//start event search for groups
router.get('/events/search', async (req, res) => {
   try {
       const allEvents = await scheduleEventsForGroups();
       res.status(200).json(allEvents);
   } catch (error) {
       console.error("Error fetching events:", error)
       res.status(500).json({ error: "Could not get events." });
   }
})


module.exports = router