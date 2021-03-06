const User = require('../models/User');

/**
* Creates a collection of Users
*/
class Users {
  /**
  * Defines properties for the Users collection
  */
  constructor() {
    this.users = new Map();
    this.usersBySocketId = new Map();
    this.totalUsersCreated = 0;
  }
  /**
  * Instantiates new Users
  * @params {string} - a User's unique device ID
  */
  createUser(deviceId) {
    const newUser = new User(++this.totalUsersCreated, deviceId);
    this.addUserToCollection(newUser);
    return newUser;
  }

  mapUserIdToSocketId(socketId, userId) {
    this.usersBySocketId.set(socketId, userId);
  }

  /**
  * Inserts users into the collection
  * @params {object} - a User instance
  */
  addUserToCollection(newUser) {
    this.users.set(newUser.userId, newUser);
    return User;
  }
  /**
  * Removes a User from the collection
  * @params {number} - a User ID
  */
  destroy(userId) {
    this.users.delete(userId);
    return null;
  }
  /**
  * Retrieves a user from the collection
  * @params {number} - a User ID
  */
  getOne(userId) {
    return this.users.get(userId);
  }

  getBySocketId(socketId) {
    console.log('Users by socket Id:', this.usersBySocketId);
    return this.usersBySocketId.get(socketId);
  }
}

module.exports = Users;
