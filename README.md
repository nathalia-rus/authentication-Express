# authentication-Express

# Server & Authentication Basics: Express, Sessions, Passport, and cURL


# NOTES ON SERVER.JS 

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

// l. 41
// cd auth cd client
// curl -X POST http://localhost:3000/login -b cookie-file.txt -H 'Content-Type: application/json' -d '{"email":"test@test.com", "password":"password"}'
//  -X POST instead of -X GET,  -H flag to set the header content-type to application/json, -d flag in along with the data that I want to send
// but server log: req.body is ‘undefined’.
// Express doesn’t actually know how to read the JSON content-type, 
// so need to add another middleware to do this. 
// --> body-parser middleware to body parse the data and add it to the req.body property.


// on done() : every function returns. The done() callback is a convention you use on top of that when return isn't enough because it happens too soon.

// curl -X GET http://localhost:3000/authrequired -b cookie-file.txt -L
// the L flag tells cURL to follow redirects. 


//  functions serializeUser and deserializeUser :
// the functions tell Passport.js how to get information from a user object to store in a session (serialize), and how to take that information and turn it back into a user object (deserialize).
https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize


// how cookies and sessions work:
https://stackoverflow.com/questions/11142882/how-do-cookies-and-sessions-work

# DB NOTES

// in db / package.json / script added :  "json:server": "json-server --watch ./db.json --port 5000"
// json-server is a package that automatically sets up RESTful routes for data in the db.json file.

# AXIOS NOTES

// run with json:server cf script added, then other terminal window and --> npm install axios --save
--> In our LocalStrategy configuration, we’re now going to fetch our user object from the /users REST endpoint using the email address as a query parameter (like before, but was manually done)
While we’re at it, let’s also update our configuration to handle invalid user credentials or any errors that are returned by axios from the json-server.
--> passport.deserializeUser() function: let’s return the user object by calling axios to retrieve the /users endpoint and passing in the user id in the path (i.e. /users/:id).
-->  + handle the various errors that could pop up during authentication in our passport.authenticate() callback function, and instead of simple telling the user that they have logged in, let’s redirect the user to the /authrequired path.


--> NOTES ON AUTHENTICATION FLOW ( for passport.js) :

- The user is going to POST their login information to the /login route

- We need to do something with that data. This is where passport comes in. We can call passport.authenticate(‘login strategy’, callback(err, user, info) ). 
This method takes 2 parameters. Our ‘login strategy’ which is ‘local’ in this case, since we will be authenticating with email and password (you can find a list of other login strategies using passport though. These include Facebook, Twitter, etc.) and a callback function giving us access to the user object if authentication is successful and an error object if not.

- passport.authenticate() will call our ‘local’ auth strategy, so we need to configure passport to use that strategy. We can configure passport with passport.use(new strategyClass). Here we tell passport how the local strategy can be used to authenticate the user.

- Inside the strategyClass declaration, we will take in the data from our POST request, use that to find the matching user in the database and check that the credentials match. If they do match, passport will add a login() method to our request object, and we return to our passport.authenticate() callback function.

- Inside the passport.authenticate() callback function, we now call the req.login() method.

- The req.login(user, callback()) method takes in the user object we just returned from our local strategy and calls passport.serializeUser(callback()). It takes that user object and 1) saves the user id to the session file store 2) saves the user id in the request object as request.session.passport and 3) adds the user object to the request object as request.user. Now, on subsequent requests to authorized routes, we can retrieve the user object without requiring the user to login again (by getting the id from the session file store and using that to get the user object from the database and adding it to our request object).





