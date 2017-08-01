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
    taxonomies = utils.getTaxonomies(body.taxonomies);   
    res.json({ taxonomies });
  });
});

app.get('/events', function(req, res){
  let seatgeekUrl = process.env.SEATGEEK_EVENT_URL;
  const ticketmasterUrl = process.env.TICKETMASTER_URL;

  seatgeekUrl += "&per_page=1000";
  seatgeekUrl += "&sort=datetime_utc.asc";
  seatgeekUrl += "&lowest_price.gte=20";
  seatgeekUrl += "&average_price.lte=1000";
  seatgeekUrl += "&taxonomies.name=" + req.query.category;
  seatgeekUrl += "&postal_code=" + req.query.zipCode;
  // seatgeekUrl += "&postal_code=94108";
  // seatgeekUrl += "&taxonomies.name=concert";
  let data;
  async.parallel([
    function(callback) {
      request.get({
        'url': seatgeekUrl,
        'json': true,
      }, function(err, response, body){
        if(err) return callback(err);
        console.log("Length", utils.parseSeatGeek(body.events, req).length);
        data = utils.parseSeatGeek(body.events, req);
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
    else { res.json({ data }) };

  });
});


const parseToMessenger = (events) => {
  let jsonElements = [];
  const maxSubtitleLength = 80; //max subtitle length
  const maxTitleLength = 40; // max title length
  const maxGalleryItems = 9; //max Gallery items length
  _.forEach(events, function(obj, id) {
    console.log(obj, id);
    // if (obj.description.length > maxSubtitleLength) {
    //   obj.description = obj.description.substring(0, maxSubtitleLength);
    // } 
    // if (obj.name.length > maxTitleLength) {
    //   obj.name = obj.name.substring(0, maxTitleLength);
    // }
    // var messengerObj = {
    //   "title": obj.name,
    //   "image_url": "https://www.fortlewis.edu/portals/165/icons/news-features.png",
    //   "subtitle": obj.description,
    //   "buttons": [
    //     {
    //       "type":"web_url",
    //       "url": obj.url,
    //       "title":"Go to URL"
    //     },
    //   ]
    // }
    // jsonElements.push(messengerObj);
  });

  if (jsonElements.length > 0 && jsonElements.length < 9) {
    res.json({
      "messages": [
          {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements": elements
              }
            }
          }
        ]
    });
  }
  else {
    res.json({
     "messages": [
       {"text": "Sorry I don't have any results for you"},
     ]
    });
  }
}


var port = process.env.PORT || 8000;
app.listen(port);
console.log("App listening on port " + port);
