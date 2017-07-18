exports.parseSeatGeek = (data) => {
  console.log("data", data);

}

exports.parseTicketMaster = (data) => {
  console.log("tm data", data);
}

exports.getTaxonomies = (taxonomies) => taxonomies.map(taxonomy => {
  const obj = {};
  obj[taxonomy.slug] = taxonomy.name;
  return obj;
});

