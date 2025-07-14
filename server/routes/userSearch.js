const express = require('express')
const router = express.Router()

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient()

const { isAuthenticated } = require('../middleware/CheckAutheticated')


//user search endpoint
router.get('/search/users', isAuthenticated, async (req, res) => {

   const { searchQuery } = req.query;

   try {
        //find users with username, firstname, and/or last name that start with the search query passed from the frontend (make filter case insensitive)
       const userResults = await prisma.user.findMany({
           where: {
               OR: [
                   {username: { startsWith: searchQuery, mode: 'insensitive'}},
                   {userProfile: {firstName: {startsWith: searchQuery, mode: 'insensitive'}}},
                   {userProfile: {lastName: {startsWith: searchQuery, mode: 'insensitive'}}},
               ]
           },
           select: {username: true, id: true}
       })
       res.status(201).json(userResults)
   } catch (error) {
       console.error("Error fetching user results:", error)
       res.status(500).json({ error: "Something went wrong while searching for users." })
   }
})




module.exports = router
