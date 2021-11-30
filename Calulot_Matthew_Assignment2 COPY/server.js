var data = require('./public/product_data.js');// Loads products_data.js
var express = require('express'); // Enables express module 
var app = express(); // Sets the express module as the app 
var products_array = data.products_array;// Defines products_array variable
var quantity_data // Defines quantity_data variable for functions
var fs = require('fs');// Load fs model to allow server.js to use an template (referenced at bottom)
const user_registration_info = 'user_registration_info.json';// Stores user_registration_info.json as a variable
var qty_available = products_array.quantity_available[i]

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });
 
// Take the data in the body (allows you to get the POST data) and turns it into an object.
 app.use(express.urlencoded({ extended: true })); 

 // Process purchase requests (validate quantities, check quantity available)
 // If the quantities are valid, display invoice. If not, send back to products_display
 app.post("/purchase", function (request, response) {
    let POST = request.body;
    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is not undefined
        var validAmount = true; // creates variable 'validAmount' and assumes it will be true
        var amount = false; // create variable 'amount' and assuming it will be false

        for (i = 0; i < `${(products_array[`quantity_available`][i])}`.length; i++) { //for all products check if the input
            qty = POST[`quantity${i}`]; 

            if (qty > 0) {
                amount = true; // is there an amount?
            }

            if (isStringNonNegInt(qty) == false) { //if it is not a nonnegative integer
                validAmount = false; //show that it is not a valid quantity
            }

        }

        const stringified = queryString.stringify(POST); //converts the data in POST to a JSON string and sets it to variable 'stringified'

        if (validAmount && amount) { //if it is both a quantity over 0 and is valid
            var contents = fs.readFileSync('./views/login_page.template', 'utf8');
            response.send(eval('`' + contents + '`' + stringified));// redirect the page to the login page
            return; //stops function
        }

        else { response_string = "<script> alert('Error! One or more of your values are invalid! Please go back and put valid qunatities');window.history.go(-1);</script>";
        response.send(response_string);}

    }
}); 

// Function that calculates values for the invoice
function generate_item_rows(POST, response) {
        // Subtotal is 0 at first
        subtotal = 0;
        invoice_rows = '';
        // If quantity is greater than 0, display the invoice
        for (i in products_array) {
            qty = quantity_data[`quantity${i}`];
            if(qty > 0 && qty > qty_available) {
                // Generates the item rows for products -> Taken from Invoice4 WOD
                extended_price = qty * products_array[i].price
                subtotal = subtotal + extended_price;
                invoice_rows += (`
                <tr>
                <td style="text-align: left;">${products_array[i].product}</td>
                <td align="center">${qty}</td>
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

// Function from info_server_Ex5.js
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

// Adapted from Lab14 Ex. 3/4
// Checks if user_registration file is found
if (fs.existsSync(user_registration_info)) {

    stats = fs.statSync(user_registration_info);
    console.log(`user_registration_info.json has ${stats['size']} characters`);

    var data = fs.readFileSync(user_registration_info, 'utf-8');
    users_reg_data = JSON.parse(data);


} else {
    console.log(`ERR: ${user_registration_info} does not exist`)
}

// Display login page from the registration
app.get("/login", function (request, response) {
    // Assumes no login errors
    var incorrect_login = [];
    var incorrect_password = [];
    var incorrect_username = [];
    var contents = fs.readFileSync('./template/login_page.template', 'utf8');
    response.send(eval('`' + contents + '`'));
});

// Process login page through post and redirect to invoice if valid; if not, redirect back to page
app.post("/process_login", function (request, response) {
        console.log(quantity_data);
        var POST = request.body;
    //Assume no errors at first
        var incorrect_login = [];
        var incorrect_password = [];
        var incorrect_username = [];
    //Make the username lowercase
        var lowercase_username = request.body.username.toLowerCase();
    //If the username exists, retrieve the password
        if (typeof users_reg_data[lowercase_username] != 'undefined') {//if user inputted data
            if (request.body.password == users_reg_data[lowercase_username].password) {
            //if password and username is correct display the invoice
                generate_item_rows(POST, response);
                console.log('User logged in');
            } else {
            //if the password is not correct display that password is not correct
                incorrect_password.push('No matching password found. Please enter your password again');
            //alert user that the login could not go through and redirect to login page
                incorrect_login = "alert(`Incorrect login. Please recheck, and if you do not have an account, please register!`);";
                var contents = fs.readFileSync('./template/login_page.template', 'utf8');
                response.send(eval('`' + contents + '`'));
                console.log('Password was incorrect');
        }
    } else {
        // If the username is not correct display that the username does not match 
            incorrect_username.push('Username does not exist! Please check your username');
        // And alert user that the login did not go through
            incorrect_login = "alert(`Incorrect login. Please recheck, and if you do not have an account, please register!`);";
            var contents = fs.readFileSync('./template/login_page.template', 'utf8');
            response.send(eval('`' + contents + '`'));
            console.log('Username incorrect!');
    }

});


// Display registration page from the login
app.get("/register", function (request, response) {
    // Assume no errors at first
    var fullname_registration_errs = [];
    var username_registration_errs = [];
    var password_registration_errs = [];
    var password_repeat_errs = [];
    var email_registration_errs = [];
    var reg_error = "";
    var contents = fs.readFileSync('./template/registration_page.template', 'utf8');
    response.send(eval('`' + contents + '`'));
});

// Process registration page
app.post("/process_register", function (request, response) {
    // process a simple register form
    var fullname_registration_errs = [];
    var username_registration_errs = [];
    var password_registration_errs = [];
    var password_repeat_errs = [];
    var email_registration_errs = [];

    // VALIDATION
    // Function validates the full name
    function validate_fullname(name_input) {
        // Pushes error if the full name was not inputted
        if (name_input == "") {
            fullname_registration_errs.push('Please enter your full name');
        }
        // Pushes an error if the full name is over 30 characters
        if ((name_input.length > 30)) {
            fullname_registration_errs.push('max fullname characters is 30');
        }
        // If the full name was not all letters: https://stackoverflow.com/questions/9289451/regular-expression-for-alphabets-with-spaces
        if (/^[A-Za-z ]+$/.test(name_input) == false) {
            // Pushes an error that the full name needs to all letters
            fullname_registration_errs.push('Full name can only be letters');
        }
    }
    // Checks if valid name was inputted
    validate_fullname(request.body.fullname);

    // Function validates username
    function validate_username(username_input) {
        // If the username already exists, push an error 
        if (typeof users_reg_data[username_input] != 'undefined') {
            username_registration_errs.push('This username is not available. Choose another');
        }
        // If username is not letters or numbers modified from: https://stackoverflow.com/questions/11431154/regular-expression-for-username-start-with-letter-and-end-with-letter-or-number, push an error
        if ((/^[0-9a-zA-Z]+$/).test(username_input) == false) {
            
            username_registration_errs.push('Username must be numbers or letters');
        }
        // If user name is not between 4 and 10 characters, push an error
        if (username_input.length < 4 || username_input.length > 10) {
            username_registration_errs.push('Username must be between 4 or 10 characters long');
        }
    }
    // Checking if a valid username was inputted
    var reg_username = request.body.username.toLowerCase();//make username lowercase
    validate_username(reg_username);

    // Function validates password
    function validate_password(password_input) {
        password_repeat = request.body.repeat_password
        // If password length is less than 6 characters long, push an error
        if ((password_input.length < 6)) {
            password_registration_errs.push('Password must be more than 6 characters long');
        }
        // Check if password entered equals to the repeat password entered, if not, push an error
        if (password_input !== password_repeat) {
            password_repeat_errs.push('Password does not match! Please re-enter');
        }
    }

    // Checking if a valid password was inputted
    validate_password(request.body.password);

    // Email validation function adapted from https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
    function validate_email(email_input) {
        // If the email doesn't follow a specific format as stated, push email invalid error
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email_input) == false) {
            email_registration_errs.push('Email is invalid');
        }
    }
    // Check email validation and turn into lowercase
        var registration_email = request.body.email.toLowerCase(); 
        validate_email(registration_email);

    // If all data is valid write to the users_data_filename and send to invoice
    if ((fullname_registration_errs.length == 0) && (username_registration_errs.length == 0) && (password_registration_errs.length == 0) && (password_repeat_errs.length == 0) && (email_registration_errs.length == 0)) {

        // Formats inputted data to user_registration_info.json
        users_reg_data[reg_username] = {};
        users_reg_data[reg_username].fullname = request.body.fullname;
        users_reg_data[reg_username].password = request.body.password;
        users_reg_data[reg_username].email = request.body.email.toLowerCase();

        // Writes updates objects to user_registration_info
        reg_info_str = JSON.stringify(users_reg_data);
        fs.writeFileSync(user_registration_info, reg_info_str);
        console.log(`saved`)
        generate_item_rows(request.body, response);

    } else {
        // If the user data is not valid, alert user and display errors in the console
        console.log(fullname_registration_errs);
        console.log(username_registration_errs);
        console.log(password_registration_errs);
        console.log(password_repeat_errs);
        console.log(email_registration_errs);
        reg_error = "alert(`Unable to register. Please recheck submissions fields for valid inputs!`);";
        var contents = fs.readFileSync('./template/registration_page.template', 'utf8');
        response.send(eval('`' + contents + '`'));
    }

})

// Routes the GET requests to the public directory
    app.use(express.static('./public'));
// Allows the server to run on port 8080
    app.listen(8080, () => console.log(`listening on port 8080`)); 
