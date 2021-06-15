require('dotenv').config();
var express = require('express');
var compression = require('compression');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Promise = require("bluebird");
Promise.config({
    longStackTraces: true,
    warnings: true
})
app.use(compression());
var passport = require('passport');
app.use(passport.initialize());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization, Access-Control-Allow-Headers");
    next();
});
var http = require('http').Server(app);
http.listen(process.env.ApiPort, function() {
    console.log('listening on *:' + process.env.ApiPort);
});
app.get('/', function(req, res) {
    res.send('server working');
});
// app.use(express.static(__dirname + '/'));

//api route
app.use('/api', require('./controllers/api'));