const { nextISSTimesForMyLocation} = require('./iss');


const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  printPassTimes(passTimes);

});