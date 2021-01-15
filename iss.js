/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);


    if (error) {
      callback(error, null);
      return;
    }
     
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const ip = JSON.parse(body).ip;
    callback(null, ip);

     
  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */


const fetchCoordsByIP = function(ip, callback) {
  
  request('https://freegeoip.app/json/184.162.102.167', (error, response, body) => {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }


    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    const coordObj = {"latitude": latitude, "longitude": longitude};

    callback(null, coordObj);

    



  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */


const fetchISSFlyOverTimes = function(coords, callback) {
  const latitude = coords.latitude;
  const longitude = coords.longitude;
  
  request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }

    const data = JSON.parse(body).response;
    callback(null, data);




  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(data, (error, passes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passes);
      });
    });
  });

};



module.exports = { nextISSTimesForMyLocation };