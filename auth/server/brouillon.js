// npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const axios = require('axios');

// configures passport.js to use the local strategy :

passport.use(new LocalStategy(
  { usernameField: 'email' },
  // if we had username, username instead
  (email, password, done) => {
    axios.get(`http://localhost:5000/users?email=${email}`)
      .then(res => {
        const user = res.data[0]
        if (!user) {
          return done(null, false,
            { message: 'Invalid credentials.\n' })
        }
        if (password != user.password) {
          return done(null, false, { message: 'invalid credentials.\n' })
        }
      })
    return done(null, user)
      .catch(error => done(error))
  }
));

// tells passport how to serialize the user : 

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  axios.get(`http://localhost:5000/users/${id}`)
    .then(res => done(null, res.data))
    .catch(error => done(error, false))
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
    if (info) { return res.send(info.message) }
    if (err) { return next(err); }
    if (!user) { return res.redirect('./login'); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/authrequired');
    })
  })(req, res, next);
})


// adding route that requires autorization :
// --tells our sever which routes require a user to be 
// logged in before they can be visited -checks if authenticated
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


