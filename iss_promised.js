const request = require('request-promise-native');


const fetchMyIP = function () {
  return request('https://api.ipify.org?format=json')
};

const fetchCoordsByIP = function(resultFromFetchMyIP) {
  const ip = JSON.parse(resultFromFetchMyIP).ip
  return request(`https://freegeoip.app/json/${ip}`)
 
};

const fetchISSFlyOverTimes = function(body) {
  const latitude = JSON.parse(body).latitude;
  const longitude = JSON.parse(body).longitude
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`

  return request(url);
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const response = JSON.parse(body).response;
      return response;
    });
}



module.exports = { nextISSTimesForMyLocation };