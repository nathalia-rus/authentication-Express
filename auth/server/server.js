// npm modules
const express = require('express');
// create the server 
const app = express();

//  creates the homepage route at '/'
app.get('/', (req, res) => {
  res.send('you just hit the home page\n')
})

// tell the server what port to listen on
app.listen(3000, ()=> {
  console.log('Listening in localhost: 3000')
})




