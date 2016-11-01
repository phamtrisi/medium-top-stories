var updateTopStoriesTask = require('./tasks/update-top-stories');
var medium = require('./utils/medium');


try {
    // updateTopStoriesTask();
    medium.updateTopStories();
}
catch(e) {
    // Fail silently
}

