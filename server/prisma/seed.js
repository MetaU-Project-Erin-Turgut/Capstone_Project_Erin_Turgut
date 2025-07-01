const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const interests = [
    {id: 0, title: 'Music', parent_id: null},
    {id: 1, title: 'Sports',  parent_id: null},
    {id: 2, title: 'Cooking',  parent_id: null},
    {id: 3, title: 'Singing',  parent_id: 0},
    {id: 4, title: 'Karaoke',  parent_id: 3},
    {id: 5, title: 'Basketball',  parent_id: 1},
    {id: 6, title: 'Rock',  parent_id: 0},
    {id: 7, title: 'Indie Rock',  parent_id: 6},
    {id: 8, title: 'Hard Rock',  parent_id: 6},
    {id: 9, title: 'ACDC',  parent_id: 8},
];
const groups = [
    {id: 0, title: 'Group Karaoke', description: 'Karaoke Group in Menlo Park', is_full: false, interest_id: 4, central_location: 'fake coordinates'},
    {id: 1, title: 'Group ACDC', description: 'ACDC Group in Menlo Park', is_full: false, interest_id: 9, central_location: 'fake coordinates'},
    {id: 2, title: 'Group ACDC better', description: 'Karaoke Group in Menlo Park', is_full: true, interest_id: 9, central_location: 'fake coordinates'},
    {id: 3, title: 'Group Hard Rock', description: 'Hard Rock Group in Menlo Park', is_full: false, interest_id: 8, central_location: 'fake coordinates'},
    {id: 4, title: 'Group Rock', description: 'Rock Group in Menlo Park', is_full: true, interest_id: 6, central_location: 'fake coordinates'},
    {id: 5, title: 'Group Music', description: 'Music Group in Menlo Park', is_full: false, interest_id: 0, central_location: 'fake coordinates'},
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
        const groupRecord = await prisma.group.create({
            data: {
                title: group.title,
                description: group.description,
                is_full: group.is_full,
                central_location: group.central_location,
                core_interest: {
                    connect: { id: group.interest_id }
                }
            }

        })
        console.log(`Created group: ${groupRecord.title}`)
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