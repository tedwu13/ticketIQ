const _ = require('lodash');

exports.parseSeatGeek = (data, req) => {
  let events = [];
  const popularEvents = _.filter(data, function(x) {
    return x.popularity >= 0.75 && x.score >= 0.75;
  })

  _.map(popularEvents, function(data) {
    let eventObj = {
      'image': data.performers[0].image,
      'name': data.short_title,
      'popularity': data.popularity,
      'score': data.score,
      'stats': data.stats,
      'local_time': data.datetime_local,
      'type': data.type,
      'venue': data.venue,
      'url': data.url,
      'network': 'seatgeek'
    };
    events.push(eventObj);
  })
  return events;
}

exports.parseTicketMaster = (data, req) => {
}

exports.getTaxonomies = (taxonomies) => taxonomies.map(taxonomy => {
  const obj = {};
  obj[taxonomy.slug] = { 'name' : taxonomy.name, 'id': taxonomy.id };
  return obj;
});

exports.parseToMessenger = (events) => {
  let jsonElements = [];
  let message;
  const maxSubtitleLength = 80; //max subtitle length
  const maxTitleLength = 40; // max title length
  const maxGalleryItems = 9; //max Gallery items length
  _.forEach(events, function(obj, id) {
    if (obj.name.length > maxTitleLength) {
      obj.name = obj.name.substring(0, maxTitleLength);
    }
    let messengerObj = {
      "title": obj.name,
      "image_url": obj.image,
      "subtitle": obj.venue.name,
      "buttons": [
        {
          "type":"web_url",
          "url": obj.url,
          "title":"Go to URL"
        },
      ]
    }
    jsonElements.push(messengerObj);
  });
  let topEvents = jsonElements.slice(0, 9);
  if (topEvents.length > 0 && topEvents.length < 10) {
    console.log("more than 0 and 9 elements");
    message = {
      "messages": [
        {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements": topEvents
            }
          }
        }
      ]
    };
  } else {
    message = {
      "messages": [
        {"text": "Sorry I don't have any results for you"},
      ]
    };
  }
  return message;
}


const distance = (lat1, lon1, lat2, lon2) => {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

