const request = require('request');
const Games = require('../collections/Games');

const joinOrStartGameURL = 'http://127.0.0.1:1234/api/play/';

console.log('open games ', Games.openGames);

const sendNewOrRandomGameRequest = (deviceId, requestOptions) => {
  const id = deviceId || 'defaultTestDeviceId';
  const options = requestOptions || {
    method: 'GET',
    uri: joinOrStartGameURL + id,
  };
  request(options, (err, res, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
      console.log('open games ', Games.openGames);
    }
  });
};

sendNewOrRandomGameRequest();

setTimeout(() => (console.log('open games after timeout', Games.openGames), 5000));
