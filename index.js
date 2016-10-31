var express = require('express');
var app = express();
var env = process.env;
var port = env.SERVER_PORT || 8888;

// Routes
app.get('/', function (req, res) {
    res.send('ok');
});

// Start server
app.listen(port, function () {
    console.log('Server started on port', port);
});
