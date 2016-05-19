const express = require('express');
const Users = require('../collections/Users');
const UserController = require('../controllers/UserController');
// const ioCreate = require('socket.io');
// const app = express();
// const server = require('http').createServer(app);
// const io = ioCreate.listen(server);
// const onConnect = require('../sockets/onConnect');
// const onDisconnect = require('../sockets/onDisconnect');

describe('User controller', () => {
  const users = new Users();
  const testUser = UserController.create({ params: 'anotherDeviceId' }, null, users);
  const db = {
    users,
  };

  // Mock socket connection object
  let mockSocket = {
    id: 'SomeFakeSocketID'
  };
  it('should create users', () => {
    // this test user was created without making an API call
    // instantiation through an API call is tested in basicServerTests.js
    expect(Object.keys(testUser).length).toEqual(8);
  });
  it('should impart users with a socket connection object', () => {
    expect(testUser.socket).toBe(null);
    UserController.connect(db, testUser, mockSocket);
    expect(testUser.socket).not.toBe(null);
  });
  it('should get users', () => {
    expect(UserController.get(users, 1
      )).not.toBe(undefined);
  });
});
