// npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// create the server 
const app = express();

// add and configure middleware 
app.use(session({
  genid: (req) => {
    console.log('inside the session middleware')
    console.log(req.sessionID)
    return uuid()  // use UUIDs for session IDs
  },
  store: new FileStore(),
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


  // create new cookie file that will be saved to the client:
  // ps: add -v for verbose -more details can be read
  // client $ curl -X GET http://localhost:3000 -c cookie-file.txt
  // this sends the session id we created before we restarted the server (-b flag):
  // client $ curl -X GET http://localhost:3000 -b cookie-file.txt
  


// If I restart the server again, the memory will be wiped again:
//  need to have some way of making sure that I can save  
// session id even if the server shuts down.
// ---> ‘session store’ comes in there:
// Normally,  database would act as a session store, 
// but let's keep things as simple as possible
// let’s just store our session info in text files.
// using npm package: session-file-store 



// When we use the the ‘session - file - store’ module, 
// by default, it creates a new ‘/sessions’ directory when it is first called. 
// The first time and each subsequent time that we create a new session, 
// the module creates a new file for the session info in the /sessions folder.
// Since we import the session-file - store in server.js and the session - file - store 
// depends on the / sessions folder, nodemon will restart the server each time we create a new session.
// We can tell nodemon to ignore a file or directory by calling ‘— ignore’ 
// and passing it the file or directory name:
// server $ nodemon--ignore sessions / server.js
// This will be annoying to remember if you ever come back to this project again 
// and want to figure out how to run the server.Let’s make it easy on ourselves 
// by adding it to our npm scripts in the package.json file.
// -> ("scripts": {
// "test": "echo \"Error: no test specified\" && exit 1",
//   "dev:server": "nodemon --ignore sessions/ server.js"
//   }, )
// then terminal: npm run dev:server 


// ok, now, when I create a new cookie file that is saved to the client:
// client $ curl -X GET http://localhost:3000 -c cookie-file.txt
// iand then I kill the server and run
// client $ curl -X GET http://localhost:3000 -b cookie-file.txt so gets the same session id 
// and I run the server again, and it saved indeed the session on the server side! 
// getting the same session id output by server every time :))

