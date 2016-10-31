var express = require('express');
var cheerio = require('cheerio');
var app = express();
var env = process.env;
var port = env.PORT || 8888;

app.get('/', function (req, res) {
    res.json({
        status: 'ok'
    });
});

app.listen(port, function () {
    console.log('Server started on port', port);
});
