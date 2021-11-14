var express = require('express');
var app = express();

app.post('/process_form', function (request, response, next) { // app.post('/process_form) adds a route to respond to process_form
    response.send('in POST /test'); // take whatever the request is to the path, then sending it back to you

});

app.all('*', function (request, response, next) { // * means any path. 
    console.log(request.method + ' to path ' + request.path + ' query string ' + JSON.stringify(request.query)); // take whatever the request is to the path, then sending it back to you
    next(); // next is going to be the callback function of the next thing in the response chain (Express sets up what's next, as long as there is a route to the request you made)
});

app.use(express.static('./public')); // go into the public directory and look into the path you say in the directory, get the file, then send it back
                                     // also allows you to serve static files an
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback