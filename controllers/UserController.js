module.exports = {
  get(userCollection, userId) {
    return userCollection.getOne(userId);
  },
  create(req, res, userCollection, callback) {
    if (!callback) {
      return userCollection.createUser(req.params.deviceId);
    }
    return callback(userCollection.createUser(req.params.deviceId));
  },
};
