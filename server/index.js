const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 3000;

const eventRoutes = require('./routes/events')
const groupRoutes = require('./routes/groups')
const authRoutes = require('./routes/auth')
const interestRoutes = require('./routes/interests')
const userSearchRoutes = require('./routes/userSearch')

const EVENT_SEARCH_INTERVAL = 86400000; //1 day in milliseconds

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

//routes are defined in these files
app.use(authRoutes) //sign up, login, logout, and check for active session
app.use(eventRoutes) //operations relating to user's event data
app.use(groupRoutes) //operations relating to user's group data
app.use(interestRoutes) //operations relating to getting and selecting interests
app.use(userSearchRoutes) //endpoints for user search

//this matches upcoming events to groups
const triggerEventMatching = async () => {
  try {
    const response = await fetch('http://localhost:3000/events/search', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw { status: response.status, message: data.error };
    }

  } catch (error) {
    console.log("Status ", error.status);
    console.log("Error: ", error.message);
  }

}

//run on startup
triggerEventMatching();

//set interval to run the function every time period specified by EVENT_SEARCH_INTERVAL 
setInterval(triggerEventMatching, EVENT_SEARCH_INTERVAL);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})