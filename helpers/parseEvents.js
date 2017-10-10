const _ = require('lodash');
const fetch = require('isomorphic-fetch')

exports.parseSeatGeek = (data) => {
  let events = [];
  const popularEvents = _.filter(data, function(x) {
    return x.popularity >= 0.50 || x.score >= 0.50;
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

const fetchTickets = () => {
  fetch('https://api.seatgeek.com/2/events?client_id=NzU0MzAwMHwxNDk5NTY5MTA2Ljk4&aid=12614')
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json.events);
      return json.events;
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

exports.mapCategory = (query) => {
  if(query === 'Concerts') {
    query = 'concert';
  } else if (query === 'Sports') {
    query = 'sports';
  } else if (query === 'Theater') {
    query = 'theater';
  } else if (query === 'Comedy') {
    query = 'comedy';
  } else if(query === 'Classical') {
    query = 'classical';
  } else if (query === 'Baseball') {
    query = 'baseball';
  } else if (query === 'Soccer') {
    query = 'soccer';
  }

  return query;
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
      "subtitle": "Venue: " + obj.venue.name,
      "buttons": [
        {
          "type":"web_url",
          "url": obj.url,
          "title":"Buy Ticket", 
        },
        {
          "type":"element_share",
          "share_contents": "Share with Friends",
        },
        {
          "type": "show_block",
          "block_name": "Bot Menu",
          "title": "Go Back to Main Menu"
        },
      ]
    }
    jsonElements.push(messengerObj);
  });
  let topEvents = jsonElements.slice(0, 9);
  if (topEvents.length > 0 && topEvents.length < 10) {
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
        {"text": "Sorry I don't have any results for you around your location however here are the other events and services you might be interested" },
        {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements": [
                {
                  "title":"Popular SeatGeek Events",
                  "image_url":"https://www.google.com/imgres?imgurl=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F701823810744487937%2FpcmlLoAd_400x400.png&imgrefurl=https%3A%2F%2Ftwitter.com%2Fseatgeek&docid=gxk08gBlvskIRM&tbnid=UgVqA4-rq8wdYM%3A&vet=10ahUKEwj4rdTh7eTWAhUirVQKHddODVsQMwg0KA4wDg..i&w=400&h=400&bih=869&biw=1744&q=seatgeek%20image%20url&ved=0ahUKEwj4rdTh7eTWAhUirVQKHddODVsQMwg0KA4wDg&iact=mrc&uact=8",
                  "subtitle":"Top Rated Events at Seatgeek",
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"https://seatgeek.com/?aid=12614",
                      "title":"Visit Website"
                    }
                  ]
                },
                {
                  "title":"Popular Ticketmaster Events",
                  "image_url":"http://is5.mzstatic.com/image/thumb/Purple118/v4/6d/4c/95/6d4c9501-8bf5-aa79-79db-aa7edeb5600d/source/1200x630bb.jpg",
                  "subtitle":"Top Rated Events at Ticketmaster",
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"http://www.ticketmaster.com/",
                      "title":"Visit Website"
                    }
                  ]
                }
              ]
            }
          }
        }
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

