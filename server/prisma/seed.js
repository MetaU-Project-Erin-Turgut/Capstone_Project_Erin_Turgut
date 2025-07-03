const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const interests = [
    {id: 0, title: 'Music', parent_id: null, level: 1},
    {id: 1, title: 'Sports',  parent_id: null, level: 1},
    {id: 2, title: 'Cooking',  parent_id: null, level: 1},
    {id: 3, title: 'Singing',  parent_id: 0, level: 2},
    {id: 4, title: 'Karaoke',  parent_id: 3, level: 3},
    {id: 5, title: 'Basketball',  parent_id: 1, level: 2},
    {id: 6, title: 'Rock',  parent_id: 0, level: 2},
    {id: 7, title: 'Indie Rock',  parent_id: 6, level: 3},
    {id: 8, title: 'Hard Rock',  parent_id: 6, level: 3},
    {id: 9, title: 'ACDC',  parent_id: 8, level: 4},
];
const groups = [
    {title: 'Group Karaoke MPK', description: 'Karaoke Group in Menlo Park', is_full: false, interest_id: 4, latitude: 37.4855, longitude: -122.1500},
    {title: 'Group ACDC Tokyo', description: 'ACDC Group in Tokyo', is_full: false, interest_id: 9, latitude: 35.6895, longitude: 139.6917},
    {title: 'Group ACDC better MPK', description: 'Karaoke Group in Menlo Park', is_full: true, interest_id: 9, latitude: 37.4855, longitude: -122.1500},
    {title: 'Group Hard Rock MPK', description: 'Hard Rock Group in Menlo Park', is_full: false, interest_id: 8, latitude: 37.4855, longitude: -122.1500},
    {title: 'Group Rock MPK', description: 'Rock Group in Menlo Park', is_full: true, interest_id: 6, latitude: 37.4855, longitude: -122.1500},
    {title: 'Group Music MPK', description: 'Music Group in Menlo Park', is_full: false, interest_id: 0, latitude: 37.4855, longitude: -122.1500},
]
async function main() {
    console.log(`Start seeding ...`)

    // Clear the tables first
    await prisma.interest.deleteMany()
    await prisma.group.deleteMany()
    
    for (const interest of interests) {
        const interestRecord = await prisma.interest.create({
            data: interest
        })
        console.log(`Created interest: ${interestRecord.title}`)
    }
    
    for (const group of groups) {
        const groupRecord = await prisma.$queryRaw`INSERT INTO "Group" (title, description, is_full, coord) VALUES(${group.title}, ${group.description}, ${group.is_full}, ST_SetSRID(ST_MakePoint(${group.longitude}, ${group.latitude}), 4326)::geography)`;

        console.log(`Created group: ${group.title}`)
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