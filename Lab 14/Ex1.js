var userdate = require('./user_data.json');
var fs = require('fs');
var filename = 'user_data.json'

var express = require('express');
var app = express();
var myParser = require("body-parser");

if( fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats["size"] + ' characters ');
    // Have reg data file, so read data and parse into user_registration_info object
    let data_str = fs.readFileSync(filename, 'utf-8')
    var user_registration_info = JSON.parse(data_str)
    console.log(user_registration_info)
} else {
    console.log(filename + 'does not exist!')
}

app.use(express.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username']
    let login_password = request.body['password']
    // Check if username exists, then check password entered matched STORED password 
    if(typeof user_registration_info[login_username] != 'undefined') {
        if(user_registration_info[login_username] ["password"] == login_password) {
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
