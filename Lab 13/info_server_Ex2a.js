var express = require('express');
var app = express();

app.get('/test', function (request, response, next) { // * means anything. 
    response.send('in in GET /test'); // take whatever the request is to the path, then sending it back to you
});

app.all('*', function (request, response, next) { // * means any path. 
    console.log(request.method + ' to path ' + request.path + ' query string ' + JSON.stringify(request.query)); // take whatever the request is to the path, then sending it back to you
    next(); // next is going to be the callback function of the next thing in the response chain (Express sets up what's next, as long as there is a route to the request you made)
});



app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback