const _ = require('lodash');

exports.parseSeatGeek = (data, req) => {
  let events = [];
  const popularEvents = _.filter(data, function(x) {
    return x.popularity >= 0.75 && x.score >= 0.75;
  })

  _.map(popularEvents, function(data) {
    let eventObj = {
      'image': data.image,
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

exoports.parseToMessengerFormat = (events) => {
  let jsonElements = [];
  const maxSubtitleLength = 80; //max subtitle length
  const maxTitleLength = 40; // max title length
  const maxGalleryItems = 9; //max Gallery items length
  _.forEach(events, function(obj, id) {
    console.log(obj);
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

  if (jsonElements.length > 0) {
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

const distance = (lat1, lon1, lat2, lon2) => {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

