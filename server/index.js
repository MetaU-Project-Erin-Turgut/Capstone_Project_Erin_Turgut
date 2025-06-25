const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 3000;

const eventRoutes = require('./routes/events')
const authRoutes = require('./routes/auth')

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}))

app.use(express.json())

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET, 
  resave: false, //won't be saving sessions to database for now
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 } //1 hour session
}))


app.use(authRoutes)
app.use(eventRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})