exports.parseSeatGeek = (data) => {
  console.log("data", data);

}

exports.parseTicketMaster = (data) => {
  console.log("tm data", data);
}

exports.getTaxonomies = (taxonomies) => {
  return taxonomies.map(taxonomy => taxonomy.slug);
}

