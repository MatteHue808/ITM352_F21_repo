//copied from Lab13 Ex4  and heavily adapted to display the invoice. Referenced Assignment 1 Example for inspiration, help from Professor Port
var data = require('./public/products_data.js');//loads the product.json
var products_array = data.products_array;//sets the products_array variables
var express = require('express');//enabling the usage of the express module
var app = express();//setting the express module as app
var myParser = require("body-parser");
var fs = require('fs');// references fs module to read the file path to invoice template
//const { response } = require('express');


//writes the request message
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
//telling to run the display_invoice function when data is posted assuming not undefined (copied from Lab 13)
app.post("/process_form", function (request, response) {
    //check if data is valid display invoice or don't respond
    //assme no error
    haserrors = false;
    //assume no quantities
    hasquantities= false;
    //check if no errors if error true, check if has quantities if there are, then true
    for (i in products_array) {
        qty = request.body[`quantity${i}`];
        if(qty>0) {
            hasquantities=true;
        }
        if (isNonNegInt(qty) == false) {
            haserrors = true;
        }
    }
    //if there are quantities and there are no error display the invoice if not then alert
    if (haserrors == false && hasquantities ==true) {
        display_invoice(request.body, response);
    } else{
        response_string="<script> alert('Error! please go back and put valid qunatities');window.history.go(-1);</script>";
        response.send(response_string);
    }
});


//computes the values needed to display the invoice
function display_invoice(POST, response) {
    if (typeof POST['submit_button'] != 'undefined') {

        invoice_rows = '';
        subtotal = 0;
        for (i in products_array) {
            qty = POST[`quantity${i}`];
            //sets the quantity amount for each product
            if (qty > 0) {
                // displays the product rows of items ordered. Copied from WOD Invoice4 invoice.html
                extended_price = qty * products_array[i].price
                subtotal = subtotal + extended_price;
                invoice_rows += (`
                <tr>
                <td style="text-align: left;">${products_array[i].brand} ${products_array[i].product_name}</td>
                <td align="center">${qty}</td>
                <td style="text-align: center">\$${products_array[i].price}</td>
                <td style="text-align: right;">\$${extended_price.toFixed(2)}</td>
              </tr>
      `);
            }
        }

        // Tax
        //From WOD Invoice4 Invoice.html 
        tax_rate = 0.0575;
        sales_tax = tax_rate * subtotal;

        // Shipping Costs
        //From WOD Invoice4  Invoice.html
        if (subtotal <= 50) {
            shipping_cost = 2;
        }
        else if (subtotal <= 100) {
            shipping_cost = 5;
        }
        else {
            shipping_cost = 0.05 * subtotal; // 5% of subtotal
        }

        // Total Amount
        //From WOD Invoice4  Invoice.html
        total = subtotal + sales_tax + shipping_cost;

        //Load template and send invoice
        var contents = fs.readFileSync('./views/invoice.template', 'utf8');//uses the invoice template which was adapted from invoice4
        response.send(eval('`' + contents + '`'));


    }
}
//copied from Lab13 Ex4
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(q=='') {q=0;}//Check if there is a blank. If there is, it is a zero
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); //references the public folder where the products is displayed
app.listen(8080, () => console.log('listening on port 8080')); //checks that server is running 
