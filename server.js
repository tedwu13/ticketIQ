var express = require('express');
var morgan  = require('morgan');
var request = require('request');
var _ = require('lodash');

var app = express();
app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.json({});
});

app.get('/discover', function(req, res){
// https://api.seatgeek.com/2/events?client_id=MYCLIENTID&client_secret=MYCLIENTSECRET

});


var port = process.env.PORT || 8000;
app.listen(port);
console.log("App listening on port " + port);
