const express = require('express');
require('dotenv').config();

const mongodb = require('./data/database');
const app = express();
const port = process.env.PORT || 8080;


app.use('/', require('./routes'));




mongodb.initDb((err) => {
  if (err) {
    console.log(err);   
    } 
    else {
        app.listen(port, () => {console.log(`Database is listening and server is running on port ${port}`)});
        }
});


