const express = require('express');
const morgan  = require('morgan');
const dotenv = require('dotenv').config();
const async = require('async');
const request = require('request');
const _ = require('lodash');
const emoji = require('node-emoji');
const utils = require("./helpers/parseEvents");

const app = express();
app.use(morgan('dev'));


app.get('/taxonomies', function(req, res) {
  const seatgeekUrl = process.env.SEATGEEK_TAXONOMIES_URL;
  request.get({
    'url': seatgeekUrl,
    'json': true,
  }, function(err, response, body){
    taxonomies = utils.getTaxonomies(body.taxonomies);   
    res.json({ taxonomies });
  });
});

app.get('/events', function(req, res){
  let seatgeekUrl = process.env.SEATGEEK_EVENT_URL;
  let ticketmasterUrl = process.env.TICKETMASTER_URL;

  seatgeekUrl += "&aid=12614";
  seatgeekUrl += "&per_page=1000";
  seatgeekUrl += "&sort=datetime_utc.asc";
  seatgeekUrl += "&lowest_price.gte=20";
  seatgeekUrl += "&average_price.lte=1000";
  seatgeekUrl += "&taxonomies.name=" + utils.mapCategory(req.query.category);
  seatgeekUrl += "&postal_code=" + req.query.zipCode;

  let data;
  async.parallel([
    function(callback) {
      request.get({
        'url': seatgeekUrl,
        'json': true,
      }, function(err, response, body){
        if(err) return callback(err);
        data = utils.parseToMessenger(utils.parseSeatGeek(body.events, req));
        callback();
      });
    },
    function(callback) {
      request.get({
        'url': ticketmasterUrl,
        'json': true,
      }, function(err, response, body) {
        if(err) return callback(err);
        // utils.parseTicketMaster(body._embedded.events, req);
        // data.push({"ticketmaster": body._embedded.events});
        callback();
      })
    }

  ], function(err) {
    //function gets called after apis are being called
    if(err) { console.log(err); };
    res.json(data);

  });
});


var port = process.env.PORT || 8000;
app.listen(port);
console.log("App listening on port " + port);
