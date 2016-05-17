const get = (userCollection, userId) => userCollection.getOne(userId);
const randomInteger = require('./utils');

const create = (req, res, userCollection, callback) => {
  const deviceId = req.params.deviceId ? req.params.deviceId : randomInteger(128732, 2904895230);
  if (!callback) {
    return userCollection.createUser(deviceId);
  }
  return callback(userCollection.createUser(deviceId));
};

const connect = (user, socket) => {
  user.socket = socket;
  return user;
};

module.exports = { get, create, connect };
