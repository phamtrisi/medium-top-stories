var CronJob = require('cron').CronJob;
var medium = require('../../utils/medium');

function updateTopStories(firebaseApp) {
    try {
        var job = new CronJob({
            cronTime: '* * * * *', // Runs every 10 mins
            start: true,
            onTick: function() {
                medium.updateTopStories(firebaseApp)
            }
        });
    }
    catch(e) {
        console.log('updateTopStories cron pattern not valid');
    }
}

module.exports = updateTopStories;
