const serverURL = 'http://127.0.0.1:1234';
const joinOrStartGameURL = 'http://127.0.0.1:1234/api/game/';
const getUserURL = 'http://127.0.0.1:1234/api/user/';
const deviceId = 'testUserDeviceId';
const request = require('request');
const GameController = require('../controllers/GameController');

exports.sendPlayRequest = (requestOptions, callback) => {
  const options = requestOptions || {
    method: 'GET',
    uri: joinOrStartGameURL,
  };
  return request(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    return callback(err, res, body);
  });
};

exports.generateTestUsers = (usersColletion, n) => {
  const testUsers = [];
  for (let i = 1; i <= n; i++) {
    testUsers.push(usersColletion.createUser(`fakeSocketId_${i}`));
  }
  return testUsers;
};

exports.populateNextOpenGameWithPlayers = (database, numberOfPlayers, arrayOfplayers) => {
  const testPlayers = arrayOfplayers || exports.generateTestUsers(database.users, numberOfPlayers);
  return testPlayers.forEach((player) => GameController.handlePlayerJoin(database.games, player));
};

exports.sendUserRequest = (requestOptions, callback) => {
  const options = requestOptions || {
    method: 'GET',
    uri: `${getUserURL}${deviceId}`,
  };
  return request(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    return callback(err, res, body);
  });
};
