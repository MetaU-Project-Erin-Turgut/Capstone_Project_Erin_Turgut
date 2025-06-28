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


async function main() {
    console.log(`Start seeding ...`)

    // Clear the table first
    await prisma.interest.deleteMany()
    
    for (const interest of interests) {
        const interestRecord = await prisma.interest.create({
            data: interest,
        })
        console.log(`Created interest: ${interestRecord.title}`)
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