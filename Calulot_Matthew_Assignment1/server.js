var data = require('./public/product_data.js');// Loads products_data.js
var express = require('express'); // Enables express module 
var app = express(); // Sets the express module as the app 
var products_array = data.products_array;// Defines products_array variables
var fs = require('fs');// Load fs module to allow server.js to use a template (referenced at bottom)

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });
 
// Take the data in the body (allows you to get the POST data) and turns it into an object.
 app.use(express.urlencoded({ extended: true })); 

 // Process purchase requests (validate quantities, check quantity available)
 // If the quantities are valid, display invoice. If not, send back to products_display
 app.post("/purchase", function (request, response, next) {

 //if there are quantities and there are no error display the invoice if not then alert 
    // Assume no errors at first
    let quantityavailable = products_array[0]['quantity_available']
    var errorsfound = false;
    // Assume no quantities at first
    var quantitiesfound = false;
    // Assume that all items are in stock at first
    var stock = true
    // Check if no errors, if error is false, check if has quantities if there are, check if products are in stock (modified function in Invoice 4 WOD)
    for (i in products_array) {
        quantity = request.body[`quantity${i}`];
        if (isStringNonNegInt(quantity) == false) {
            errorsfound = true;
        }
        if(quantity > 0) {
            quantitiesfound = true;
        }
        if(quantity > quantityavailable)
            stock = false
    }
    //If quantities are found and no errors are found in the textbox, then generate an invoice, otherwise, send an error alert!
        if (errorsfound == false && quantitiesfound == true && stock == true) {
        generate_item_rows(request.body, response);
            } else{
                response_string="<script> alert('Invalid quantities detected. Please review your purchase.');window.history.go(-1);</script>";
                response.send(response_string);
            }
});
 
 // Routes the GET requests to the public directory
 app.use(express.static('./public'));
 
 // Allows the server to run on port 8080
 app.listen(8080, () => console.log(`listening on port 8080`)); 

// Function that calculates values for the invoice
function generate_item_rows(POST, response) {
    if (typeof POST['submit_button'] != 'undefined') {

        // Subtotal is 0 at first
        subtotal = 0;
        invoice_rows = '';
        // If quantity is greater than 0, display the invoice
        for (i in products_array) {
            quantity = POST[`quantity${i}`];
            if(quantity > 0) {
                // Generates the item rows for products -> Taken from Invoice4 WOD
                extended_price = quantity * products_array[i].price
                subtotal = subtotal + extended_price;
                invoice_rows += (`
                <tr>
                <td style="text-align: left;">${products_array[i].product}</td>
                <td align="center">${quantity}</td>
                <td style="text-align: center">\$${products_array[i].price}</td>
                <td style="text-align: right;">\$${extended_price.toFixed(2)}</td>
              </tr>
      `);
            }
        }

 // All equations (tax, shipping, total) below are from Invoice4 WOD but adapted to fit shipping policies of normal pen stores
    // Hawaii tax rate is 4%
    var tax_rate = 0.04;
    var tax = tax_rate*subtotal;

    // Compute shipping
    if(subtotal <= 100) {
    shipping = subtotal*0.1; // To compensate cost of shipping for smaller items, shipping is 10% of the subtotal. 
    }
    else {
    shipping = 0.00; // Complementary shipping of 0 if subtotal is $100 or more
    }

    // Compute grand total
    var total = subtotal + tax + shipping

    //Load template and send invoice
    var contents = fs.readFileSync('./template/invoice.template', 'utf8'); // Use an Invoice Template to display invoice
    response.send(eval('`' + contents + '`'));

    }
} 
// Function from Lab 13, info_server_Ex5.js
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

