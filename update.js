var express = require('express');
var mongoose = require('mongoose');
var $ = require('cheerio');
var Menu = require('./models/menu');
var bodyParser = require('body-parser');
var request = require('request');
var iconv  = require('iconv-lite');
var router = express.Router();

process.env.TZ = 'America/Sao_Paulo';

mongoose.connect(process.env.DB_LINK);

function gotHTML(err, resp, html) {
    if (err) return console.error(err);
    var utf8String = iconv.decode(new Buffer(html), "ISO-8859-1");
    var parsedHTML = $.load(utf8String);
    var finished = 0;

   parsedHTML('table').map(function(i, link) {

      if (i === 5 || i === 6) {
         for (var idx = 0; idx < 5; idx++) {
            var refeicao = new Menu();
            var data = $('tbody tr', link).eq(2).find('td').eq(idx).find('span strong').text();
            var dataArr = data.split("/");
            var d = new Date(dataArr[2], dataArr[1] - 1, dataArr[0]);
  				var today = new Date();
            today.setHours(0,0,0,0);

            if (d.getTime() >= today.getTime()) {
               console.log("New menu info will be saved for " + d);

               refeicao.data = d;
               refeicao.principal = $(link).find('tbody tr').eq(3).find('td').eq(idx).find('p').eq(1).text();
               refeicao.guarnicao = $(link).find('tbody tr').eq(3).find('td').eq(idx).find('p').eq(4).text();
               refeicao.salada = $(link).find('tbody tr').eq(3).find('td').eq(idx).find('p').eq(7).text();
               refeicao.sobremesa = $(link).find('tbody tr').eq(3).find('td').eq(idx).find('p').eq(10).text();
               refeicao.principalVegetariano = $(link).find('tbody tr').eq(5).find('td').eq(idx).find('p').eq(3).text();
               refeicao.guarnicaoVegetariano = $(link).find('tbody tr').eq(5).find('td').eq(idx).find('p').eq(6).text();
               refeicao.almoco = i === 5 ? true : false;

               refeicao.save(function(err) {
                  if (err) {
                     console.log("ERROR SAVING: ");
                     console.log(err);
                  }
                  else {
                     console.log("Saved without errors");
                  }
                  finished++;
                  if (finished === 10) {
                     process.exit();
                  }
               });
            }
            else {
               console.log("Old data; will not be saved");
               finished++;
               if (finished === 10) {
                  process.exit();
               }
            }
         }
      }
   });
}

var date = new Date();
date.setHours(0,0,0,0);

console.log("System date: " + date);

if (date.getDay() > 0 && date.getDay() < 6) {
  console.log("It's weekday. Will run");

  Menu.find({ "data": date}).exec(
    function (err, menus) {
      if (!err && menus.length === 0) {
        console.log("No info yet. Checking UFSCar's website");
        var requestOptions  = { encoding: null, method: "GET", uri: "http://www.sorocaba.ufscar.br/ufscar/?cardapio"};
        request(requestOptions, gotHTML);
      }
      else {
        console.log("Menu already updated");
        process.exit();
      }
    });
}
else {
  console.log("It's weekend. No updates");
  process.exit();
}
