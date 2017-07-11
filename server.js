var express = require('express');
var morgan  = require('morgan');
var dotenv = require('dotenv').config();
var async = require('async');
var request = require('request');
var _ = require('lodash');

var app = express();
app.use(morgan('dev'));

// app.get('/', function(req, res) {
//   res.json({});
// });

app.get('/events', function(req, res){
  const seatgeekUrl = process.env.SEATGEEK_URL;
  const ticketmasterUrl = process.env.TICKETMASTER_URL;

  var data = [];
  async.parallel([
    function(callback) {
      request.get({
        'url': seatgeekUrl,
        'json': true,
      }, function(err, response, body){
        if(err) return callback(err);
        data.push(body);
        callback();
      });
    },
    function(callback) {
      request.get({
        'url': ticketmasterUrl,
        'json': true,
      }, function(err, response, body) {
        if(err) return callback(err);
        console.log("body", body);
        data.push(body);
        callback();
      })
    }

  ], function(err) {
    //function gets called after apis are being called
    if(err) { console.log(err); };
    res.json({});
    console.log("SHOWING RESULTS", data);
  });

// https://api.seatgeek.com/2/events?client_id=MYCLIENTID&client_secret=MYCLIENTSECRET

});


var port = process.env.PORT || 8000;
app.listen(port);
console.log("App listening on port " + port);
