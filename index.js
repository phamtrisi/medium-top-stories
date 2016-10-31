var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var app = express();
var env = process.env;
var port = env.PORT || 8888;
var MEDIUM_TOP_STORIES_URL = 'https://medium.com/browse/top';
var AMAZON_TEXT_CHARACTERS_LIMIT = 4500;

function parseHtmlToJsonData(html) {
    var $ = cheerio.load(html);
    var $container = $('.homeContainer-stream');
    var $topStories = $container.find('.streamItem');
    var stories = [];
    var storiesContentPromises = [];

    $topStories.each(function(idx, $story) {
        if (idx < 5) {
            var $story = $(this);
            var title = $story.find('.graf--title').text();
            var content = 'This is the content of ' + title;
            var url = $story.find('.postArticle-content a').eq(0).attr('href');
            var storyContentPromise = new Promise(function(resolve, reject) {
                request(url, function(err, resp, body) {
                    var $;
                    var content;
                    if (err) {
                        reject(err);
                    }
                    else {
                        $ = cheerio.load(body);
                        content = $('.postArticle-content').eq(0).text();
                        resolve(content.substr(0, AMAZON_TEXT_CHARACTERS_LIMIT));
                    }
                });
            });

            storiesContentPromises.push(storyContentPromise);

            stories.push({
                uid: idx,
                updateDate: new Date(),
                titleText: title,
                mainText: content,
                redirectionUrl: url
            });
        }
    });

    return Promise.all(storiesContentPromises).then(function(storiesContent) {
        stories.forEach(function(story, idx) {
            story.mainText = storiesContent[idx];
        });

        return stories;
    });
}

app.get('/', function (req, res) {
    request(MEDIUM_TOP_STORIES_URL, function(err, resp, body) {
        parseHtmlToJsonData(body).then(function(stories) {
            res.json(stories);
        });
    })
});

app.listen(port, function () {
    console.log('Server started on port', port);
});
