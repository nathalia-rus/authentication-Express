// npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session')

// create the server 
const app = express();

// add and configure middleware 
app.use(session({
  genid: (req) => {
    console.log('inside the session middleware')
    console.log(req.sessionID)
    return uuid()  // use UUIDs for session IDs
  },
  secret : 'keyboard cat', // see comment below
  resave: false,
  saveUninitialized: true
}))

//  creates the homepage route at '/'
app.get('/', (req, res) => {
  console.log("Inside the homepage callback function")
  console.log(req.sessionID)
  res.send(`you just hit the home page yay!`)
})

// tell the server what port to listen on
app.listen(3000, ()=> {
  console.log('Listening in localhost: 3000')
})


// NOTES

// l. 16:
  // in the session configuration above, 
  // leaving the ‘secret’ as ‘keyboard cat’, 
  // but in production this would be replaced with a randomly 
  // generated string that’s pulled from an environment variable


// If I restart the server again, the memory will be wiped again:
//  need to have some way of making sure that I can save  
// session id even if the server shuts down.
// ---> ‘session store’ comes in there:
// Normally,  database would act as a session store, 
// but let's keep things as simple as possible
// let’s just store our session info in text files.

