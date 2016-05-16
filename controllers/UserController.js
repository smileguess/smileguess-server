const get = (userCollection, userId) => userCollection.getOne(userId);

const create = (req, res, userCollection, callback) => {
  if (!callback) {
    return userCollection.createUser(req.params.deviceId);
  }
  return callback(userCollection.createUser(req.params.deviceId));
};

const connect = (user, socket) => {
  user.socket = socket;
  return user;
};

module.exports = { get, create, connect };
