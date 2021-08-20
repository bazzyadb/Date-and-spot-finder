var express = require('express');
var router = express.Router();
const DateSpotDatabase = require('../models/dateSpots');

const intersetVsTypeMap = {
  'Malls': ['Shopping', 'Fun', 'Spa'],
  'Restaurant': ['Chinese Food', 'Italian Food', 'Indian Food', 'Cousine', 'Arabic Food', 'American Food', 'Romanian Food',
                'Mexican Food', 'Australian Food', 'Foody', 'Food', 'Drinks'],
  'Cinema': ['Movies', 'Fun', 'Romantic', 'Love', 'Thrilling', 'Stories'],
  'Hotel': ['Chill', 'Relax', 'Moody', 'Food', 'Wonderful', 'Exploring', 'Adventurous'],
  'Cricket Match': ['Cricket', 'Sports', 'Fun', 'Enthusiastic'],
  'Beach': ['Fun', 'Chill', 'Relaxing', 'Moody', 'Adventure', 'Waves', 'Water'],
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    lat1 = parseFloat(lat1); lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2); lon2 = parseFloat(lon2);
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

sanitizeString = (value) => {
    try {
      if(!value) {
        return value;
      }
      value.trim();
      value.toString();
      return value;
    }
    catch(err) {
        console.log(err);
    }
}

findTopPlacesMatchingUserInterests = async (user_obj, places_obj) => {
  var matched = [];
  await Promise.all(user_obj.likes.map((like) => {
    places_obj.map((place) => {
      var type = place['Type'];
      var listOfLikes = intersetVsTypeMap[type];
      if(matched.length >= 10) return matched;
      if(listOfLikes && listOfLikes.includes(like) && !matched.includes(place)) {
       matched.push(place);
      }
    });
  }));
  return matched;
}

findTopPlacesMatchingGenderPreference = async (user_obj, places_obj) => {
  if(user_obj.gender === 'female') {
    places_obj.sort((place1, place2) => {
      return
      place1['NumberOfFeMalesinADay'] - place1['NumberOfMalesinADay'] < place2['NumberOfFeMalesinADay'] - place2['NumberOfMalesinADay']
      ? 1: -1;
    });
  }
  else {
    places_obj.sort((place1, place2) => {
      return place1['NumberOfMalesinADay'] - place1['NumberOfFeMalesinADay'] < place2['NumberOfMalesinADay'] - place2['NumberOfFeMalesinADay']
      ? 1: -1;
    });
  }

  if(places_obj.length > 50) {
    places_obj = places_obj.slice(0, 50);
  }
  return places_obj;
}

findTopPlacesMatchingUserBudget = async (user_obj, places_obj) => {
  const places = places_obj.filter(place => place['AverageDateCostinINR'] <= user_obj.budget);
  return places;
}

findTopPlacesNeartoUser = async (user_obj, places_obj) => {
  places_obj.sort((place1, place2) => {
    const d1 = getDistanceFromLatLonInKm(user_obj.latitude, user_obj.longitude, place1['Latitude'], place1['Longitude']);
    const d2 = getDistanceFromLatLonInKm(user_obj.latitude, user_obj.longitude, place2['Latitude'], place2['Longitude']);
    return d1 > d2? 1 : -1;
  });
  if(places_obj.length > 25) {
    places_obj = places_obj.slice(0, 25);
  }
  return places_obj;
}

findTopHighlyRatedPlaces = async (user_obj, places_obj) => {
  places_obj.sort((place1, place2) => {
    return place1['Rating'] < place2['Rating']? 1 : -1;
  });
  if(places_obj.length > 100) {
    places_obj = places_obj.slice(0, 100);
  }
  return places_obj;
}

router.post('/', async function(req, res) {
  const name = sanitizeString(req.body.planDateFor);
  const gender = sanitizeString(req.body.gender);
  const likes = req.body.likes;
  const age = req.body.age;
  const latitude = req.body.startingLatitude;
  const longitude = req.body.startingLongitude;
  const budgetinINR = req.body.budget;
  const user_obj = {
    name: name,
    gender: gender,
    likes: likes,
    age: age,
    latitude: latitude,
    longitude: longitude,
    budget: budgetinINR,
  }

  const places_obj = await DateSpotDatabase.find({});
  console.log(places_obj.length);
  var matched = await findTopHighlyRatedPlaces(user_obj, places_obj);
  matched = await findTopPlacesMatchingGenderPreference(user_obj, matched);
  matched = await findTopPlacesMatchingUserBudget(user_obj, matched);
  matched = await findTopPlacesNeartoUser(user_obj, matched);
  matched = await findTopPlacesMatchingUserInterests(user_obj, matched);
  console.log(matched.length);
  res.send(matched);
});

module.exports = router;
