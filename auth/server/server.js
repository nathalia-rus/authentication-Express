// npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;

const users = [
  { id: '45gH7', email: 'test@test.com', password: 'password' }
]

// configures passport.js to use the local strategy :

passport.use(new LocalStategy(
  { usernameField: 'email' },
  // if we had username, username instead
  (email, password, done) => {
    console.log('Inside local stretegy callback')
    // here, you'd make the call to the database
    // like ‘DB.findById()’ 
    // to find the user based on their username or email address
    // but for now let's just pretend we found that it was users[0]
    const user = users[0]
    if (email === user.email && password === user.password) {
      console.log('Local strategy returned true')
      return done(null, user)
    }
  }))

// tells passport how to serialize the user : 

passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});


// create the server :

const app = express();

// add and configure middleware :


app.use(bodyParser.urlencoded({ extended: false }))
// added this because if I add an actual frontend to the app, 
// the data in the POST request Content-Type would come through as a ‘application/x-www-form-urlencoded’

app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    console.log('inside the session middleware')
    console.log(req.sessionID)
    return uuid()  // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat', // see comment in readme 
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
// call this middleware after we configure our app to use express-session 
// and the session-file-store, because passport rides on top of these.

//  creates the homepage route at '/' :

app.get('/', (req, res) => {
  console.log("Inside the homepage callback function")
  console.log(req.sessionID)
  res.send(`you just hit the home page yay!`)
})

// create the login get and post routes 
// in the post method, 
//  calling ‘req.body’: 
// this should log the data that  sent to the server in the POST request.
app.get('/login', (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.send(`You got the login page!\n`)
})

app.post('/login', (req, res, next) => {
  console.log("Inside POST / login callback function")
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, err => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.user)}`)
      return res.send('You were authenticated and logged in!\n');
    })
  })
  (req, res, next);
})


// add a route that requires autorization :
// --tells our sever which routes require a user to be 
// logged in before they can be visited
app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback')
  console.log(`User authenticated? ${req.isAuthenticated()}`)
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})



// tell the server what port to listen on :

app.listen(3000, () => {
  console.log('Listening in localhost: 3000')
})

