// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var $ = require('cheerio');
var Menu = require('./models/menu');
var bodyParser = require('body-parser');
var request = require('request');
var iconv  = require('iconv-lite');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect(process.env.DB_LINK);

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;
process.env.TZ = 'America/Sao_Paulo';

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Welcome!' });
});


var weekRoute = router.route('/thisWeek');

weekRoute.get(function(req, res) {
    console.log("Finding menus between " + getMonday() + " and " + getFriday());
    Menu.find({ "data": {"$gte": getMonday(), "$lte": getFriday()}}).exec(
      function (err, menus) {
        if (err) {
          res.json({ "message": "error", "menu": null});
        }
        else if (menus.length === 0) {
          res.json({ "message": "menu not available", "menu": null});
        }
        else {
          res.json({ "menu": menus});
        }
      });
});


var todayRoute = router.route('/today');

todayRoute.get(function(req, res) {
  var d = new Date();
  d.setHours(0,0,0,0);

  console.log("Finding menus for today, " + d);
  Menu.find({ "data": d}).exec(
      function (err, menus) {
        if (err) {
          res.json({ "message": "error", "menu": null});
        }
        else if (menus.length === 0) {
          res.json({ "message": "menu not available", "menu": null});
        }
        else {
          res.json({ "menu": menus});
        }
      });
});


function getMonday() {
  var d = new Date();
  d.setHours(0,0,0,0);
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getFriday() {
  var d = new Date();
  d.setHours(0,0,0,0);
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -2:5); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
