const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { filterGroupsByLocation } = require('./Utils');

const scheduleEventsForGroups = async () => {
    //get all events from Event table that have not passed - this method also filters out events from the database that have passed
    const allEvents = await getAllEvents();

    for (retrievedEvent of allEvents) {
        const eventCoords = {
            longitude: retrievedEvent.st_x,
            latitude: retrievedEvent.st_y,
        }
        //for this event, find groups within location range
        const groupsNearby = await filterGroupsByLocation(eventCoords, true);

        //for these groups, additionally filter by ones that include this event's interest in their array of interests AND haven't been sent this event invite yet
        const candidateGroups = await getCandidateGroups(groupsNearby, retrievedEvent.interest_id, retrievedEvent.id);
        for (group of candidateGroups) {
            const inviteStatus = sendInvitesToUsers();
            if (inviteStatus === 200) {
                //invites sent, now update group_event table
                await createGroup_Event(group.id, retrievedEvent.id);

                // TODO: also update user_event tables for each user in the group

            } else {
                throw Error("Invites failed to send");
            }

        }
    }
    return allEvents;
}

const createGroup_Event = async (groupId, eventId) => {
    return await prisma.group_Event.create({ 
        data: {
            group: { connect: { id: groupId } },
            event: { connect: { id: eventId } }
        }
    })
}

const sendInvitesToUsers = () => {
    // TODO: will implement public api for sending invites soon, for now just return 200 to mock 200 ok status
    return (200);
}

const getCandidateGroups = async (allGroupsNearby, eventInterest, eventId) => {
    const groupIds = allGroupsNearby.map((group) => {
        return group.id;
    })

    return await prisma.group.findMany({
        where: {
            id: { in: groupIds },
            interests: {
                some: {
                    interest_id: eventInterest
                }
            },
            events: {
                none: {
                    event_id: eventId,
                },
            }
        },
        include: {
            interests: {
                select: { interest: { select: { level: true, title: true } } }
            }
        }
    });
}

const getAllEvents = async () => {
    const currDate = new Date();

    //clear out events from database that have passed
    await prisma.event.deleteMany({
        where: {
            dateTime : {
                lt: currDate
            }
        },
    })

    //return upcoming events - should be what's left
    return await prisma.$queryRaw`
   SELECT ST_X(coord::geometry), ST_Y(coord::geometry), "id", "title", "description", "dateTime", "interest_id" FROM "Event"`;


}

module.exports = { scheduleEventsForGroups };