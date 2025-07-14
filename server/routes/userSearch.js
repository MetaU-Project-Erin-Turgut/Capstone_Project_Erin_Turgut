const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated')


//user search endpoint
router.get('/search/users', isAuthenticated, async (req, res) => {

    const { searchQuery } = req.query;

    /*note: usernames should be one word, so if the search query had a space, that means the user is searching for a first and last name. If there is a second keyword, search by matching
        first AND last name, else just search for first word match with either username, firstname, or lastname */
    const keywords = searchQuery.split(" ");
    const firstWord = keywords.at(0);
    let lastWord = null
    if (keywords.length > 1) {
        lastWord = keywords.at(1)
    }

    try {
        //find users with username, firstname, and/or last name that start with the search query passed from the frontend (make filter case insensitive)

        //note: learned about usage of spread operator for conditional where clause in prisma from here: https://stackoverflow.com/questions/72197774/how-to-call-where-clause-conditionally-prisma
        const userResults = await prisma.user.findMany({
            where: {
                    ...( lastWord ? {
                            AND: [
                                { userProfile: { firstName: { startsWith: firstWord, mode: 'insensitive' } } },
                                { userProfile: { lastName: { startsWith: lastWord, mode: 'insensitive' } } },
                            ]
                        }
                        : 
                        {
                            OR: [
                                { username: { startsWith: firstWord, mode: 'insensitive' } },
                                { userProfile: { firstName: { startsWith: firstWord, mode: 'insensitive' } } },
                                { userProfile: { lastName: { startsWith: firstWord, mode: 'insensitive' } } },
                            ]
                        }
                    )
                },
                select: { username: true, id: true }
            })
        res.status(201).json(userResults)
    } catch (error) {
        console.error("Error fetching user results:", error)
        res.status(500).json({ error: "Something went wrong while searching for users." })
    }
})




module.exports = router
