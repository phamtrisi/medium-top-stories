var express = require('express');
var firebaseApp = require('./utils/firebase')();
var app = express();
var env = process.env;
var port = env.PORT || 8888;
var updateTopStoriesTask = require('./tasks/update-top-stories');
var database = firebaseApp.database();

// Start the cron
try {
    updateTopStoriesTask(firebaseApp);
}
catch(e) {
    // Fail silently
}

// Routes
app.get('/', function (req, res) {
    database.ref('/stories').once('value', function(stories) {
        res.json(stories.val());
    });
});

// Start server
app.listen(port, function () {
    console.log('Server started on port', port);
});
