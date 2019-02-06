require('dotenv').config()
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const util = require('util');
const moment = require('moment');

// App
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Make a .env with the following details
const r = new Snoowrap({
    userAgent: 'reddit-bot-413DX',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const client = new Snoostorm(r);

const streamOpts = {
    subreddit: 'all', // all
    results: 25,
    pollTime: 1500 // It updates every 1,1 seconds, this will allow some room to breathe for the API.

};

const submissionStream = client.SubmissionStream(streamOpts);
submissionStream.on("submission", function (post) {
    var content = {
        time: moment().calendar(),
        username: post.author.name,
        subreddit: post.subreddit.display_name,
        link: post.url
    };
    io.emit('postdata', content);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const port = 80;
http.listen(process.env.PORT || port, function () {
    console.log('The app is live on port 80 or your process.env.PORT');
});