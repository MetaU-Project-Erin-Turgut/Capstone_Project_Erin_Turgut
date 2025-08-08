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

const users = [
    {firstName: "Debbie", lastName: "Downer", address: "1 Hacker Wy, Menlo Park", email: "deb@gmail.com", username: "deb", password: "123456789"},
    {firstName: "Sarah", lastName: "Smith", address: "1 Hacker Wy, Menlo Park", email: "sarah@gmail.com", username: "sarah_123", password: "123456789"},
    {firstName: "Amanda", lastName: "Jane", address: "1 Hacker Wy, Menlo Park", email: "amanda@gmail.com", username: "amanda_j", password: "123456789"},
    {firstName: "John", lastName: "Smith", address: "1 Hacker Wy, Menlo Park", email: "john@gmail.com", username: "john_1", password: "123456789"},
    {firstName: "John", lastName: "Joe", address: "1 Hacker Wy, Menlo Park", email: "JJ@gmail.com", username: "jj", password: "123456789"},
    {firstName: "John", lastName: "Ron", address: "1 Hacker Wy, Menlo Park", email: "joe@gmail.com", username: "J_ron", password: "123456789"},
    {firstName: "John", lastName: "Alex", address: "1 Hacker Wy, Menlo Park", email: "JAlex@gmail.com", username: "J0hn_65", password: "123456789"},
    {firstName: "John", lastName: "Doe", address: "1 Hacker Wy, Menlo Park", email: "JDoe@gmail.com", username: "john@_4", password: "123456789"},
    {firstName: "John", lastName: "Wayne", address: "1 Hacker Wy, Menlo Park", email: "JW@gmail.com", username: "john_wayne", password: "123456789"},
    {firstName: "John", lastName: "John", address: "1 Hacker Wy, Menlo Park", email: "JJohn@gmail.com", username: "john_4_7", password: "123456789"},
    {firstName: "John", lastName: "Rob", address: "1 Hacker Wy, Menlo Park", email: "JRob@gmail.com", username: "johnR", password: "123456789"},
    {firstName: "John", lastName: "Doe", address: "1 Hacker Wy, Menlo Park", email: "JDJohn@gmail.com", username: "user_john", password: "123456789"},
    {firstName: "John", lastName: "Jacob", address: "1 Hacker Wy, Menlo Park", email: "Jacob_J@gmail.com", username: "john_jke4", password: "123456789"},
]

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


//seeding users 
const seedUsers = async () => {
  for (let i = 0; i < users.length; i++) {
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users[i]),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, message: data.error };
      }

    } catch (error) {
      console.log("Status ", error.status);
      console.log("Error: ", error.message);
    } 
  }
} 

seedUsers();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})