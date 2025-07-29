const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient()
const router = express.Router()
const rateLimit = require("express-rate-limit");

const opencage = require('opencage-api-client'); //public api

const { EventType } = require('../systems/Utils');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: { error: "Too many failed login attempts. Try again later." },
});

const saltRounds = 10;

//Signup route
router.post('/signup', async (req, res) => {
    const { address, username, email, password, firstName, lastName } = req.body;

    try {
        if (!username || !email || !password || !firstName || !lastName || !address) {
            return res.status(400).json({ error: "First name, last name, address, username, email, and password are required." });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long." });
        }

        // Check if username is already taken
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUsername) {
            return res.status(400).json({ error: "Username already exists" })
        }

        // Check if email is already taken
        const existingUserEmail = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUserEmail) {
            return res.status(400).json({ error: "Account already created with this email" })
        }

        let userCoords = {latitude: null,longitude: null}

        /*****Forward geocoding of provided address - the following code has been implemented and modified based on the
        example implementation from api documentation: https://opencagedata.com/tutorials/geocode-in-nodejs ***********/
        await opencage
        .geocode({ q: address })
        .then((data) => {
            if (data.status.code === 200 && data.results.length > 0) {
                const place = data.results[0];
                userCoords.latitude = place.geometry.lat;
                userCoords.longitude = place.geometry.lng;
            } else {
                console.log('Status', data.status.message);
                console.log('total_results', data.total_results);
            }
        })
        .catch((error) => {
            console.log('Error', error.message);
            if (error.status.code === 402) {
                console.log('Request limit reached');
            }
        });
        /************************************* end of code from third-party api documentation *********************************/

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create a new user in the database
        //for mock data, have all users start out with location at meta's headquarters
        const queryResult = await prisma.$queryRaw`INSERT INTO "User" (address, username, email, password, "eventTypeTallies", coord) VALUES(${address}, ${username}, ${email}, ${hashedPassword}, ${new Array(EventType.NUMTYPES).fill(0)}, ST_SetSRID(ST_MakePoint(${userCoords.longitude}, ${userCoords.latitude}), 4326)::geography) RETURNING id, address, username, email, password, ST_AsText(coord);`;

        const newUser = queryResult.at(0);
        // Store user ID and username in the session, allowing them to remain authenticated as they navigate the website
        req.session.userId = newUser.id
        req.session.username = newUser.username

        //connect to a new user profile as well
        await prisma.user.update({
            where: {id: req.session.userId},
            data: {userProfile: { create: {firstName: firstName, lastName: lastName}}}
        })

        res.status(201).json({ message: "Sign up successful!", id: newUser.id, username: newUser.username }) 


    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong during signup" })
    }

})

//Login route
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required to sign in" })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ error: "Invalid email" })
        }

        //if user was found, compare entered password to hashed password in database

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error validating password, come back later." })
            }
            if (result) {
                //Successful login:

                // Store user ID and username in the session, allowing them to remain authenticated as they navigate the website
                req.session.userId = user.id
                req.session.username = user.username

                res.status(201).json({ message: "Login successful!", id: user.id, username: user.username }) 

            } else {
                return res.status(401).json({ error: "Invalid email or password" })
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong during login" })
    }
})

//endpoint to verify if user has an active session
router.get('/me', async (req, res) => {
    if (!req.session.userId) { //session does not exist
        return res.status(401).json({ message: "User not logged in" })
    }

    try {
        //get user from database with id equal to session id and get just their username
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: { username: true }
        })

        res.json({ id: req.session.userId, username: user.username })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching user session data" })
    }
})

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out" });
        }
        res.clearCookie("connect.sid"); // Clear session cookie
        res.json({ message: "Logged out successfully" });
    });
});

//endpoint to get current user in session's info
router.get('/user', async (req, res) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {id: req.session.userId},
            include: {userProfile: true}
        })
        res.status(201).json(userData)
    } catch (error) {
        console.error("Error fetching user info:", error)
        res.status(500).json({ error: "Something went wrong while user info." })
    }
})

module.exports = router