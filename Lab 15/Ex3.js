var fs = require('fs');
var filename = 'user_data.json'
var express = require('express');
var app = express();
var myParser = require("body-parser");
var session = require('express-session'); // read documentation for express-session! do the same for cookies too // Instead of using var quantity_data, use a session!!! // A session is perfect for a shopping cart --> take what they want and put it into their session --> if they want to checkout, get all the things they want to put there
const { request, response } = require('express');
app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

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

// Add route to handle GET to use_session --> session data is stored in memory by default
app.get("/use_session", function (request, response) {
    console.log (request.cookies);
    response.send (`Welcome, your session ID is ${request.session.id}`); // Server is using the cookie, but the browser stores the cookie too
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
<form action="register" method="POST">
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

 app.post("/register", function (request, response) { // processes registration!
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    //write updated object to user_data_filename
    data_str = JSON.stringify(users_reg_data);
    fs.writeFileSync(user_data_filename, data_str);
 });

 app.get("/login", function (request, response) {
    // Check is already logged in by seeing if the username cookie exists 
    var welcome_str = 'Welcome! You need to log in.'
    if(typeof request.cookies.username != 'undefined' ) {
        welcome_str = `Welcome ${request.cookies.login_username}! You logged in last on ${request.session.lastLogin}`
    }
    // Give a simple login form
    str = `
    <body>
    ${welcome_str} <br>
    <form action="POST" method="POST">
    <input type="text" name="username" size="40" placeholder="enter username" ><br />
    <input type="password" name="password" size="40" placeholder="enter password"><br />
    <input type="submit" value="Submit" id="submit">
    </form>
    </body>
    `;
    response.send(str);
 });

app.post("/login", function (request, response) { // processes log in! 
    // Get last login time from session if it exists. If not, create first login.
    var lastLoginTime = 'first visit!';
    if(typeof request.session.lastLogin != 'undefined') {
        lastLoginTime = request.session.lastLogin;
    } 
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username'];
    let login_password = request.body['password'];
    console.log(lastLoginTime);
    // Check if username exists, then check password entered matched STORED password 
    if(typeof users_reg_data[login_username] != 'undefined') {
        if(users_reg_data[login_username] ["password"] == login_password) {
            request.session.lastLogin = new Date(); 
            response.cookie('username', login_username);
            response.send(`${login_username} is logged in. You last logged in on ${lastLoginTime}`);
            return;
        } else {
            response.send(`incorrect password for ${login_username}`);
            response.redirect('/login');
        }
    } else {
        response.send(`${login_username} does not exist`);
    }

    response.send('processing login' + JSON.stringify(request.body));
    // Form data should be in request.body, because I posted it from the form (with username and pass)
});

app.listen(8080, () => console.log(`listening on port 8080`));
