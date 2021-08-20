const DateSpotDatabase = require('../models/dateSpots');
const names = ['Shantilal Restaurant', 'Awantika Cinema', 'Rituwan Hotel', 'Dev Restaurant', 'Ashok Palace'];
const types = ['Restaurant', 'Hotel', 'Cinema', 'Malls', 'Cricket Match', 'Beach'];
const addresses = ['abc road', 'def road', 'ghf road', 'ijk road', 'jkl road'];

// generating 500 mock data.

const maxAverageCost = 5000; // INR
const minAverageCost = 500;

const maxDuration = 250; // Minutes
const minDuration = 50;

const minStartTime = 8; // 24 hour scale
const maxStartTime = 13;

const minEndTime = 19;
const maxEndTime = 22;

const maxLatitude = 90;
const minLatitude = -90;

const maxLongitude = 180;
const minLongitude = -180;

const maxRating = 5.0;
const minRating = 0.0;

const minMales = 10;
const maxMales = 100;

const minFemales = 10;
const maxFemales = 100;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffelWord(word) {
    var shuffledWord = '';
    word = word.split('');
    while(word.length > 0) {
      shuffledWord +=  word.splice(word.length * Math.random() << 0, 1);
    }
    return shuffledWord;
}
module.exports = {
  generateMockData: () => {
    for(let i = 0; i < 50; i ++) {
      const name = shuffelWord(names[getRandomInt(0,names.length - 1)]);
      const address = shuffelWord(addresses[getRandomInt(0,addresses.length - 1)]);
      const type = types[getRandomInt(0,types.length - 1)];
      const cost = getRandomInt(minAverageCost, maxAverageCost);
      const duration = getRandomInt(minDuration, maxDuration);
      const startTime = getRandomInt(minStartTime, maxStartTime);
      const endTime = getRandomInt(minEndTime, maxEndTime);
      const latitude = getRandomArbitrary(minLatitude, maxLatitude);
      const longitude = getRandomArbitrary(minLongitude, maxLongitude);
      const rating = getRandomArbitrary(minRating, maxRating);
      const males = getRandomInt(minMales, maxMales);
      const females = getRandomInt(minFemales, maxFemales);
      const zipCode = getRandomInt(0, 999999).toString();
      const contact = getRandomInt(0, 9999999999).toString();

      const dateSpot = new DateSpotDatabase({
        Name: name,
        Latitude: latitude,
        Longitude: longitude,
        Address: address,
        Type: type,
        Contact: contact,
        Rating: rating,
        NumberOfMalesinADay: males,
        NumberOfFeMalesinADay: females,
        ZipCode: zipCode,
        StartTime: startTime,
        EndTime: endTime,
        AverageDateTimeInMinutes: duration,
        AverageDateCostinINR: cost
      });
      DateSpotDatabase.insertMany([dateSpot],function(err) {
          if(err) console.log(err);
          else console.log('Data may be entered succcessfully');
      });
    }
  }
}
