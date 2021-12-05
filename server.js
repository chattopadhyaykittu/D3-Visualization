/*This code is taken from Dr. Moorey's code https://github.com/jimmorey/lorem/blob/master/server.js and then modified*/

/*60% of the code is taken*/

const express = require('express');
const cors = require('cors');

const path = require('path');
const fs = require("fs");

// create an express app
const app = express();

app.use(cors())
// use the express-static middleware
app.use(express.static("public"));

//Creating the route to get the index.html file, in the original file many routes were there but over here using only the '/' route */
app.get("/", function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(4000, () => {
    console.log("server is listening on port 4000");
});