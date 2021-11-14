var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true })); // example of middleware. Take the data in the body (allows you to get the POST data) and turns it into an object.

app.post('/process_form', function (request, response, next) { // app.post('/process_form) adds a route to process_form and executes the function

    console.log(request.body);
    var q = request.body['quantity_textbox1']; // gets value of quantity_textbox and put it in q 
    if (typeof q != 'undefined') { // if no quantity in q, then no response (undefined)
            if(isStringNonNegInt(q)) {
                response.send(`Thank you for purchasing ${q} things!`); // if not undefined, respond with the following
                } else {
                    response.send (`Error: ${q} is not a quantity. Hit the back button to fix.`);
                    }
                    // Use this to create an invoice!
                    // This validates the quantity

            }  
        });
        
app.all('*', function (request, response, next) { // * means any path. --> on the console, this should say GET to path / query string {}
    console.log(request.method + ' to path ' + request.path + ' query string ' + JSON.stringify(request.query)); // take whatever the request is to the path, then sending it back to you
    next(); // next is going to be the callback function of the next thing in the response chain (Express sets up what's next, as long as there is a route to the request you made)
            // taking this out will cause the browser to time out (there's no response!)
});

app.use(express.static('./public')); // go into the public directory and look into the path you say in the directory, get the file, then send it back 
                                     // also allows you to serve static files (html, text, img, css, etc.). Decides doc type based on extension of files
                                     // this line replaces http-server
                                     // looks for index.html --> Express doesn't have anything, nothing else to respond to --> on the browser, it displays Cannot GET / 
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function isStringNonNegInt(q, returnErrors = false) {
    // Checks if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned, otherwise, returns true if q is a non-neg int. 
    errors = []; // assume no errors at first
    if (q == '') q = 0
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative 
        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer 
        }

    return returnErrors ? errors : (errors.length == 0);
}