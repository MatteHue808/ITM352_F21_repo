var http = require('http');

//create a server object:
http.createServer(function (req, res) { // request executes the function
    console.log(req.headers); // output the request headers to the console
    res.writeHead(200, { 'Content-Type': 'text/html' }); // set MIME type to HTML (a MIME indicates nature and form of a document), the server responds with html!
    res.write(`<h1>The server date is: ${Date()}</h1>`); // send a response to the client (server doesn't know it's html, but the browser does)
    res.write('<h1>The client date is: <script>document.write( Date.now() );</script></h1>'); // send another response
    res.end(); // end the response
}).listen(8080); // the server object listens on port 8080

console.log('Hello world HTTP server listening on localhost port 8080');