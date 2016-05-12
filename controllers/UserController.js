module.exports = {
  getUser(userCollection, userId) {
    return userCollection.getOne(userId);
  },
  newUser(req, res, userCollection, callback) {
    if (callback) {
      return callback(userCollection.createUser(req.params.deviceId));
    }
    return userCollection.createUser(req.params.deviceId);
  },
};
