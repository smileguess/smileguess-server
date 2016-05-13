const User = require('../models/User');

module.exports = class Users {
  constructor() {
    this.users = new Map();
    this.totalUsersCreated = 0;
  }

  createUser(deviceId) {
    const newUser = new User(++this.totalUsersCreated, deviceId);
    this.addUserToCollection(newUser);
    return newUser;
  }

  addUserToCollection(newUser) {
    this.users.set(newUser.userId, newUser);
    return User;
  }

  destroy(userId) {
    this.users.delete(userId);
    return null;
  }

  getOne(userId) {
    return this.users.get(userId);
  }
};

