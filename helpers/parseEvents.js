const _ = require('lodash');

exports.parseSeatGeek = (data, req) => {
  var filteredData = _.filter(data, function(data) {
    return data.popularity > 0.75; 
  });
  return filteredData;
}//venue: { postal_code : req.query.zipCode}, taxonomies: { name : req.query.category },

exports.parseTicketMaster = (data, req) => {
  // console.log(req);
}

exports.getTaxonomies = (taxonomies) => taxonomies.map(taxonomy => {
  const obj = {};
  obj[taxonomy.slug] = { 'name' : taxonomy.name, 'id': taxonomy.id };
  return obj;
});

