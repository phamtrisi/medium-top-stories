var updateTopStoriesTask = require('./tasks/update-top-stories');

try {
    updateTopStoriesTask();
}
catch(e) {
    // Fail silently
}

