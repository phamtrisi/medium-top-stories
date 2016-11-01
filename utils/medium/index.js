var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var moment = require('moment');
var firebaseApp = require('../firebase')();


var MEDIUM_TOP_STORIES_URL = 'https://medium.com/browse/top';
var AMAZON_TEXT_CHARACTERS_LIMIT = 4500;

// Firebase database
var database = firebaseApp.database();
var storiesRef = database.ref('/stories');

function parseHtmlToJsonData(html) {
    var $ = cheerio.load(html);
    var $container = $('.homeContainer-stream');
    var $topStories = $container.find('.streamItem');
    var stories = [];
    var storiesContentPromises = [];

    $topStories.each(function (idx, $story) {
        var $story = $(this);
        var title = $story.find('.graf--title').text();
        var content = 'This is the content of ' + title;
        var url = $story.find('.postArticle-content a').eq(0).attr('href');
        var storyContentPromise = new Promise(function (resolve, reject) {
            request(url, function (err, resp, body) {
                var $;
                var content;
                var paragraphs;
                var results = [];

                if (err) {
                    reject(err);
                }
                else {
                    $ = cheerio.load(body);
                    content = $('.postArticle-content').eq(0);
                    paragraphs = content.find('p.graf, blockquote');
                    paragraphs.each(function() {
                        var $this = $(this);
                        results.push($this.text());
                    });

                    resolve(results.join('\n'));
                }
            });
        });

        storiesContentPromises.push(storyContentPromise);

        stories.push({
            uid: idx,
            updateDate: moment.utc().format(),
            titleText: title,
            mainText: content,
            redirectionUrl: url
        });
    });

    return Promise.all(storiesContentPromises).then(function (storiesContent) {
        stories.forEach(function (story, idx) {
            story.mainText = storiesContent[idx];
        });

        return stories;
    });
}

/**
 * [updateTopStories description]
 * @return {[type]} [description]
 */
function updateTopStories() {
    request(MEDIUM_TOP_STORIES_URL, function (err, resp, body) {
        parseHtmlToJsonData(body).then(function (stories) {
            storiesRef.set(stories);
        });
    })
}

module.exports = {
    updateTopStories: updateTopStories
};