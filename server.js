var express = require('express');
var mongoose = require('mongoose');
var $ = require('cheerio');
var Menu = require('./models/menu');
var bodyParser = require('body-parser');
var request = require('request');
var iconv  = require('iconv-lite');
var router = express.Router();

// Mongolab connection
mongoose.connect(process.env.DB_LINK);

var app = express();

// Use environment defined port (heroku) or 4000 (localhost)
var port = process.env.PORT || 4000;
process.env.TZ = 'America/Sao_Paulo';

// Allow CORS
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package
app.use(bodyParser.urlencoded({
  extended: true
}));

// All routes will start with /api
app.use('/api', router);

// Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ info: "Olá!", routes: ["/semana", "/hoje", "/hoje/almoco", "/hoje/jantar"] });
});


var weekRoute = router.route('/semana');

weekRoute.get(function(req, res) {
  console.log("Buscando dados entre " + getMonday() + " e " + getFriday());
  Menu.find({ "data": {"$gte": getMonday(), "$lte": getFriday()}}).exec(
    function (err, menus) {
      if (err) {
        res.json({ "info": "erro", "cardapio": null});
      }
      else if (menus.length === 0) {
        res.json({ "info": "indisponivel", "cardapio": null});
      }
      else {
        res.json({ "info": "ok", "cardapio": menus});
      }
    });
});


var todayRoute = router.route('/hoje');

todayRoute.get(function(req, res) {
  var d = new Date();
  d.setHours(0,0,0,0);

  console.log("Buscando dados para hoje, " + d);
  Menu.find({ "data": d}).exec(
    function (err, menus) {
      if (err) {
        res.json({ "info": "erro", "cardapio": null});
      }
      else if (menus.length === 0) {
        res.json({ "info": "indisponivel", "cardapio": null});
      }
      else {
        res.json({ "info": "ok", "cardapio": menus});
      }
    });
});


function getMonday() {
  var d = new Date();
  d.setHours(0,0,0,0);
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -6:1);
  return new Date(d.setDate(diff));
}

function getFriday() {
  var d = new Date();
  d.setHours(0,0,0,0);
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -2:5);
  return new Date(d.setDate(diff));
}

app.listen(port);
console.log('Server running on port ' + port);
