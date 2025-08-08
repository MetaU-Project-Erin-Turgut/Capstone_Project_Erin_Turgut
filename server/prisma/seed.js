const { PrismaClient } = require('../generated/prisma');
const { EventType } = require('../systems/Utils');
const prisma = new PrismaClient()

const interests = [
    {id: 0, title: 'Music', parentId: null, level: 1, path: "0"},
    {id: 1, title: 'Sports',  parentId: null, level: 1, path: "1"},
    {id: 2, title: 'Cooking',  parentId: null, level: 1, path: "2"},
    {id: 3, title: 'Singing',  parentId: 0, level: 2, path: "0.3"},
    {id: 4, title: 'Karaoke',  parentId: 3, level: 3, path: "0.3.4"},
    {id: 5, title: 'Basketball',  parentId: 1, level: 2, path: "1.5"},
    {id: 6, title: 'Rock',  parentId: 0, level: 2, path: "0.6"},
    {id: 7, title: 'Indie Rock',  parentId: 6, level: 3, path: "0.6.7"},
    {id: 8, title: 'Hard Rock',  parentId: 6, level: 3, path: "0.6.8"},
    {id: 9, title: 'ACDC',  parentId: 8, level: 4, path: "0.6.8.9"},
    {id: 10, title: 'Tennis',  parentId: 1, level: 2, path: "1.10"},
    {id: 11, title: 'Baking',  parentId: 2, level: 2, path: "2.11"},
    {id: 12, title: 'Pickleball',  parentId: 1, level: 2, path: "1.12"},
    {id: 13, title: 'Ping Pong',  parentId: 1, level: 2, path: "1.13"},
    {id: 14, title: 'Soccer',  parentId: 1, level: 2, path: "1.14"},
    {id: 15, title: 'FIFA',  parentId: 14, level: 3, path: "1.14.15"},
    {id: 16, title: 'Rap',  parentId: 0, level: 2, path: "0.16"},
    {id: 17, title: 'Rap Battles',  parentId: 16, level: 3, path: "0.16.17"},
    {id: 18, title: 'Dance', parentId: null, level: 1, path: "18"},
    {id: 19, title: 'Hip Hop', parentId: 18, level: 2, path: "18.19"},
    {id: 20, title: 'Salsa', parentId: 18, level: 2, path: "18.20"},
    {id: 21, title: 'Ballet', parentId: 18, level: 2, path: "18.21"},
    {id: 22, title: 'Ballroom', parentId: 18, level: 2, path: "18.22"}
];
const groups = [
    {title: 'Menlo Music', description: 'Music group In MPK area', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 0}]},
    {title: 'Ping Pong Rookies', description: 'Group in mpk', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 13}]},
    {title: 'Gordon Ramsay who?', description: 'Best cooks period', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 2}, {"id": 11}]},
    {title: 'Trebles', description: 'We like to sing', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 3}, {"id": 4}, {"id": 7}]},
    {title: 'Group Foster City', description: 'Best in the bay area!!!', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 7}, {"id": 13}, {"id": 4}, {"id": 0}, {"id": 14}]},
    {title: 'Sports in Sunnyvale', description: 'Just Do It', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 14}, {"id": 15}]},
    {title: 'Best group in Pivot', description: 'Best of the best in Cali', isFull: false, latitude: 37.4855, longitude: -122.1500, interests: [{"id": 20}, {"id": 18}]},
];

const events = [
    {title: 'Passed event', description: 'Passed event', dateTime: new Date('2025-05-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 10}, eventType: EventType.EATING},
    {title: 'Tennis game', description: 'Tennis game in mpk', dateTime: new Date('2025-08-22T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 10}, eventType: EventType.ACTIVE},
    {title: 'Indie Rock Concert', description: 'Indie Rock concert in Mountain View', dateTime: new Date('2025-12-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 7}, eventType: EventType.ENTERTAINMENT},
    {title: 'ACDC concert', description: 'ACDC concert in Sunnyvale', dateTime: new Date('2025-11-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 9}, eventType: EventType.ENTERTAINMENT},
    {title: 'Karaoke night', description: 'Karaoke night out bay area', dateTime: new Date('2025-11-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 4}, eventType: EventType.ENTERTAINMENT},
    {title: 'Baking competition', description: 'Baking competition in mpk', dateTime: new Date('2025-10-25T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 11}, eventType: EventType.ACTIVE},
    {title: 'Soccer Tournament', description: 'Tournament in Foster city. All levels!', dateTime: new Date('2025-08-22T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 14}, eventType: EventType.ACTIVE},
    {title: 'World Cup Watch Party', description: 'At Bob\'s Burgers and Bar', dateTime: new Date('2025-08-14T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 15}, eventType: EventType.ENTERTAINMENT},
    {title: 'Ballroom Dance Lessons', description: 'Trina\'s Studio - $10 entry fee!', dateTime: new Date('2025-09-14T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 22}, eventType: EventType.ACTIVE},
    {title: 'Italian Cheese Tasting', description: 'Eataly - $5 Entry!', dateTime: new Date('2025-08-18T12:00:00Z'), latitude: 37.4855, longitude: -122.1500, interest: {"id": 2}, eventType: EventType.EATING},
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
        const groupRecordId = await prisma.$queryRaw`INSERT INTO "Group" (title, description, "isFull", coord) VALUES(${group.title}, ${group.description}, ${group.isFull}, ST_SetSRID(ST_MakePoint(${group.longitude}, ${group.latitude}), 4326)::geography) RETURNING id`;

        //for seeding, include interests 
        await prisma.group.update({
            where: {
                id: groupRecordId.at(0).id
            },
            data: {
                interests: {
                    create: group.interests.map((interest) => {
                        return { interest: { connect: interest } }
                    })
                },
                eventTypeTotals: new Array(EventType.NUMTYPES).fill(0)
            },
        })

        console.log(`Created group: ${group.title}`)
    }

     for (const event of events) {
        const eventRecordId = await prisma.$queryRaw`INSERT INTO "Event" ("title", "description", "dateTime", "eventType", "coord") VALUES(${event.title}, ${event.description}, ${event.dateTime}, ${event.eventType}, ST_SetSRID(ST_MakePoint(${event.longitude}, ${event.latitude}), 4326)::geography) RETURNING id`;

        //for seeding, include interests - would not be done this way in finished product:
        await prisma.event.update({
            where: {
                id: eventRecordId.at(0).id
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