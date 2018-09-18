# authentication-Express

# Server & Authentication Basics: Express, Sessions, Passport, and cURL

--> NOTES ON AUTHENTICATION FLOW (onto passport.js) :

- The user is going to POST their login information to the /login route

- We need to do something with that data. This is where passport comes in. We can call passport.authenticate(‘login strategy’, callback(err, user, info) ). 
This method takes 2 parameters. Our ‘login strategy’ which is ‘local’ in this case, since we will be authenticating with email and password (you can find a list of other login strategies using passport though. These include Facebook, Twitter, etc.) and a callback function giving us access to the user object if authentication is successful and an error object if not.

- passport.authenticate() will call our ‘local’ auth strategy, so we need to configure passport to use that strategy. We can configure passport with passport.use(new strategyClass). Here we tell passport how the local strategy can be used to authenticate the user.

- Inside the strategyClass declaration, we will take in the data from our POST request, use that to find the matching user in the database and check that the credentials match. If they do match, passport will add a login() method to our request object, and we return to our passport.authenticate() callback function.

- Inside the passport.authenticate() callback function, we now call the req.login() method.

- The req.login(user, callback()) method takes in the user object we just returned from our local strategy and calls passport.serializeUser(callback()). It takes that user object and 1) saves the user id to the session file store 2) saves the user id in the request object as request.session.passport and 3) adds the user object to the request object as request.user. Now, on subsequent requests to authorized routes, we can retrieve the user object without requiring the user to login again (by getting the id from the session file store and using that to get the user object from the database and adding it to our request object).



# NOTES ON SERVER.JS 


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

// l. 41
// cd auth cd client
// curl -X POST http://localhost:3000/login -b cookie-file.txt -H 'Content-Type: application/json' -d '{"email":"test@test.com", "password":"password"}'
//  -X POST instead of -X GET,  -H flag to set the header content-type to application/json, -d flag in along with the data that I want to send
// but server log: req.body is ‘undefined’.
// Express doesn’t actually know how to read the JSON content-type, 
// so need to add another middleware to do this. 
// --> body-parser middleware to body parse the data and add it to the req.body property.


// on done() : every function returns. The done() callback is a convention you use on top of that when return isn't enough because it happens too soon.


1. 
At the top of the file we are requiring passport and the passport-local strategy.
2.
Going down to the middle of the file, we can see that we configure our application to use passport as a middleware with the calls to app.use(passport.initialize()) and app.use(passport.session()). Note, that we call this after we configure our app to use express-session and the session-file-store. This is because passport rides on top of these.
3.
Going further down, we see our app.post(‘login’) method immediately calls passport.authenticate() with the local strategy.
4.
The local strategy is configured at the top of the file with passport.use(new LocalStrategy()). The local strategy uses a username and password to authenticate a user; however, our application uses an email address instead of a username, so we just alias the username field as ‘email’. Then we tell the local strategy how to find the user in the database. Here, you would normally see something like ‘DB.findById()’ but for now we’re just going to ignore that and assume the correct user is returned to us by calling our users array containing our single user object. Note, the ‘email’ and ‘password’ field passed into the function inside new LocalStrategy() are the email and password that we send to the server with our POST request. If the data we receive from the POST request matches the data we find in our database, we call the done(error object, user object) method and pass in null and the user object returned from the database. (We will make sure to handle cases where the credential don’t match shortly.)
5.
After the done() method is called, we hop into to the passport.authenticate() callback function, where we pass the user object into the req.login() function (remember, the call to passport.authenticate() added the login() function to our request object). The req.login() function handles serializing the user id to the session store and inside our request object and also adds the user object to our request object.
6.
Lastly, we respond to the user and tell them that they’ve been authenticated!
