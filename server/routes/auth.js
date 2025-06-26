const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient()
const router = express.Router()
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: { error: "Too many failed login attempts. Try again later." },
});

const saltRounds = 10;

//Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required." });
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

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create a new user in the database
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                events: {
                    create: [
                        { event: { create: { title: `${username}_bowling`, description: 'descBowling', zip_code: '75034' } } },
                        { event: { create: { title: `${username}_tennis`, description: 'descTennis', zip_code: '75034' } } },
                    ],
                },
            }
        })

        // Store user ID and username in the session, allowing them to remain authenticated as they navigate the website
        req.session.userId = newUser.id
        req.session.username = newUser.username
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

module.exports = router