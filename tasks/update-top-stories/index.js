var CronJob = require('cron').CronJob;
var medium = require('../../utils/medium');

function updateTopStories() {
    try {
        var job = new CronJob({
            cronTime: '*/3 * * * * *', // Runs every 5 mins
            start: true,
            onTick: function() {
                medium.updateTopStories()
            }
        });
    }
    catch(e) {
        console.log('updateTopStories cron pattern not valid');
    }
}

module.exports = updateTopStories;