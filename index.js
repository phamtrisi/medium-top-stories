var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var env = process.env;
var port = env.PORT || 8888;
var MEDIUM_TOP_STORIES_URL = 'https://medium.com/browse/top';

function parseHtmlToJsonData(html) {
    var $ = cheerio.load(html);
    var $container = $('.homeContainer-stream');
    var $topStories = $container.find('.streamItem');
    var stories = [];
    $topStories.each(function(idx, $story) {
        var $story = $(this);
        var title = $story.find('.graf--title').text();
        var content = 'This is the content of ' + title;
        var url = $story.find('.postArticle-content a').eq(0).attr('href');

        stories.push({
            uid: idx,
            updateDate: new Date(),
            titleText: title,
            mainText: content,
            redirectionUrl: url
        });
    });

    return stories;
}

app.get('/', function (req, res) {
    request(MEDIUM_TOP_STORIES_URL, function(err, resp, body) {
        res.json(parseHtmlToJsonData(body));
    })
});

app.listen(port, function () {
    console.log('Server started on port', port);
});
