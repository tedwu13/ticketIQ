const express = require('express');
const morgan  = require('morgan');
const dotenv = require('dotenv').config();
const async = require('async');
const request = require('request');
const _ = require('lodash');
const utils = require("./helpers/parseEvents");

const app = express();
app.use(morgan('dev'));

app.get('/taxonomies', function(req, res) {
  const seatgeekUrl = process.env.SEATGEEK_TAXONOMIES_URL;
  request.get({
    'url': seatgeekUrl,
    'json': true,
  }, function(err, response, body){
    console.log("body", body.taxonomies);
    taxonomies = utils.getTaxonomies(body.taxonomies);   
    res.json({ taxonomies });
  });
});

app.get('/events', function(req, res){
  const seatgeekUrl = process.env.SEATGEEK_EVENT_URL;
  const ticketmasterUrl = process.env.TICKETMASTER_URL;

  var data = [];
  async.parallel([
    function(callback) {
      request.get({
        'url': seatgeekUrl,
        'json': true,
      }, function(err, response, body){
        if(err) return callback(err);

        utils.parseSeatGeek(body.events);

        data.push({"seatgeek": body.events });
        callback();
      });
    },
    function(callback) {
      request.get({
        'url': ticketmasterUrl,
        'json': true,
      }, function(err, response, body) {
        if(err) return callback(err);

        utils.parseTicketMaster(body._embedded.events);
        data.push({"ticketmaster": body._embedded.events});
        callback();
      })
    }

  ], function(err) {
    //function gets called after apis are being called
    if(err) { console.log(err); };
    res.json({ data });
  });

// https://api.seatgeek.com/2/events?client_id=MYCLIENTID&client_secret=MYCLIENTSECRET

});


var port = process.env.PORT || 8000;
app.listen(port);
console.log("App listening on port " + port);
