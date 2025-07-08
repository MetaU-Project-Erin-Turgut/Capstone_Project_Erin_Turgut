const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const interests = [
    {id: 0, title: 'Music', parent_id: null, level: 1, path: "0"},
    {id: 1, title: 'Sports',  parent_id: null, level: 1, path: "1"},
    {id: 2, title: 'Cooking',  parent_id: null, level: 1, path: "2"},
    {id: 3, title: 'Singing',  parent_id: 0, level: 2, path: "0.3"},
    {id: 4, title: 'Karaoke',  parent_id: 3, level: 3, path: "0.3.4"},
    {id: 5, title: 'Basketball',  parent_id: 1, level: 2, path: "1.5"},
    {id: 6, title: 'Rock',  parent_id: 0, level: 2, path: "0.6"},
    {id: 7, title: 'Indie Rock',  parent_id: 6, level: 3, path: "0.6.7"},
    {id: 8, title: 'Hard Rock',  parent_id: 6, level: 3, path: "0.6.8"},
    {id: 9, title: 'ACDC',  parent_id: 8, level: 4, path: "0.6.8.9"},
    {id: 10, title: 'Tennis',  parent_id: 1, level: 2, path: "1.10"},
    {id: 11, title: 'Baking',  parent_id: 2, level: 2, path: "2.11"},
];
const groups = [
    {title: 'Group 1', description: 'group 1 in mpk', is_full: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 10}, {"id": 6}, {"id": 11}]},
    {title: 'Group 2', description: 'group 2 in mpk', is_full: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 8}, {"id": 7}, {"id": 1}]},
    {title: 'Group 3', description: 'group 3 in mpk', is_full: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 5}, {"id": 10}, {"id": 0}]},
    {title: 'Group Far away', description: 'far away from mpk', is_full: false, latitude: 35.6895, longitude: 139.6917, interests: [{"id": 10}, {"id": 2}, {"id": 7}]},
    {title: 'Group No related interests', description: 'group not related in mpk', is_full: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 4}]},

];

const events = [
    {title: 'Passed event', description: 'Passed event', dateTime: new Date('2025-05-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 10}},
    {title: 'Tennis game', description: 'Tennis game in mpk', dateTime: new Date('2025-07-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 10}},
    {title: 'Indie Rock Concert', description: 'Indie Rock concert in mpk', dateTime: new Date('2025-12-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 7}},
    {title: 'ACDC concert', description: 'ACDC concert in mpk', dateTime: new Date('2025-11-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 9}},
    {title: 'Baking competition', description: 'Baking competition in mpk', dateTime: new Date('2025-10-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 11}},
    {title: 'Music festival', description: 'Music festival in Tokyo', dateTime: new Date('2025-09-25T12:00:00Z'), latitude: 35.6895, longitude: 139.6917, interest: {"id": 0}},

]
async function main() {
    console.log(`Start seeding ...`)

    // Clear the tables first
    await prisma.interest.deleteMany()
    await prisma.group.deleteMany()
    await prisma.event.deleteMany()

    for (const interest of interests) {
        const interestRecord = await prisma.interest.create({
            data: interest
        })
        console.log(`Created interest: ${interestRecord.title}`)
    }
    
    for (const group of groups) {
        const groupRecordId = await prisma.$queryRaw`INSERT INTO "Group" (title, description, is_full, coord) VALUES(${group.title}, ${group.description}, ${group.is_full}, ST_SetSRID(ST_MakePoint(${group.longitude}, ${group.latitude}), 4326)::geography) RETURNING id`;

        //for seeding, include interests 
        await prisma.group.update({
            where: {
                id: groupRecordId[0].id
            },
            data: {
                interests: {
                    create: group.interests.map((interest) => {
                        return { interest: { connect: interest } }
                    })
                },
            },
        })

        console.log(`Created group: ${group.title}`)
    }

     for (const event of events) {
        const eventRecordId = await prisma.$queryRaw`INSERT INTO "Event" ("title", "description", "dateTime", "coord") VALUES(${event.title}, ${event.description}, ${event.dateTime}, ST_SetSRID(ST_MakePoint(${event.longitude}, ${event.latitude}), 4326)::geography) RETURNING id`;

        //for seeding, include interests - would not be done this way in finished product:
        await prisma.event.update({
            where: {
                id: eventRecordId[0].id
            },
            data: {
                interest: { connect: event.interest } 
            },
        })

        console.log(`Created event: ${event.title}`)
    }


    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })