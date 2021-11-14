var express = require('express'); // Enables express module 
var app = express(); // Sets the express module as the app 
var products_array = require('./product_data.json'); // Defines products_array variables

// Routing 

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });
 
 // Process purchase requests (validate quantities, check quantity available)
 
 // Routes the GET requests to the public directory
 app.use(express.static('./public'));
 
 // Allows the server to run on port 8080
 app.listen(8080, () => console.log(`listening on port 8080`)); 