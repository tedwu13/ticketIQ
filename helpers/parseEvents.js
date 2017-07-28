const _ = require('lodash');

exports.parseSeatGeek = (data, req) => {
  let filteredData = _.filter(data, function(data) {
    return data.popularity > 0.70; 
  });

  let events = [];
  _.map(filteredData, function(data) {
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
    }
    events.push(eventObj);
  })

  return events;
}

exports.parseTicketMaster = (data, req) => {
  // console.log(req);
}

exports.getTaxonomies = (taxonomies) => taxonomies.map(taxonomy => {
  const obj = {};
  obj[taxonomy.slug] = { 'name' : taxonomy.name, 'id': taxonomy.id };
  return obj;
});

// function distance(lat1, lon1, lat2, lon2) {
//   lat1 = parseFloat(lat1);
//   lat2 = parseFloat(lat2);
//   lon1 = parseFloat(lon1);
//   lon2 = parseFloat(lon2);
//   console.log("calc distance", lat1, lat2, lon1, lon2);
//   var p = 0.017453292519943295;    // Math.PI / 180
//   var c = Math.cos;
//   var a = 0.5 - c((lat2 - lat1) * p)/2 +
//           c(lat1 * p) * c(lat2 * p) *
//           (1 - c((lon2 - lon1) * p))/2;

//   return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
// }
