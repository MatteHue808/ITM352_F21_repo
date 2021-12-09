var fs = require('fs');
var filename = 'user_data.json'
var express = require('express');
var app = express();
var myParser = require("body-parser");
var cookieParser = require('cookie-parser'); // Makes cookie date appear from request
app.use(cookieParser());

// Add route to handle GET to set_cookie
app.get('/set_cookie', function (request, response) {
    response.cookie('name', 'Matthew', {maxAge: 5 * 1000}); // server responds with a cookie
    response.send('The name cookie has been sent!');
});

// Add route to handle GET to use_cookie
app.get("/use_cookie", function (request, response) {
    console.log (request.cookies);
    response.send (`Welcome to the Use Cookie page ${ request.cookies.name}`); // Server is using the cookie, but the browser stores the cookie too
});

// Checks if file exists before reading
if( fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats["size"] + ' characters ');
    // Have reg data file, so read data and parse into user_registration_info object
    let data_str = fs.readFileSync(filename, 'utf-8')
    var users_reg_data = JSON.parse(data_str)
    console.log(users_reg_data)
} else {
    console.log(filename + 'does not exist!')
}

app.use(express.urlencoded({ extended: true }));


// Route to /register
app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="process_registerform" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

 app.post("/process_registerform", function (request, response) {
    // process a simple register form
    //Ex 4a to 4b
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    //write updated object to user_data_filename
    data_str = JSON.stringify(users_reg_data);
    fs.writeFileSync(user_data_filename, data_str);
 });

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_loginform" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/process_loginform", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username']
    let login_password = request.body['password']
    // Check if username exists, then check password entered matched STORED password 
    if(typeof users_reg_data[login_username] != 'undefined') {
        if(users_reg_data[login_username] ["password"] == login_password) {
            response.send(`${login_username} is logged in`);
        } else {
            response.send(`incorrect password for ${login_username}`);
        }
    } else {
        response.send(`${login_username} does not exist`);
    }

    response.send('processing login' + JSON.stringify(request.body));
    // Form data should be in request.body, because I posted it from the form (with username and pass)
});

app.listen(8080, () => console.log(`listening on port 8080`));
