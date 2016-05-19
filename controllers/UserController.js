const utils = require('./utils');
const gameController = require('./GameController');

const get = (userCollection, userId) => userCollection.getOne(userId);

const create = (req, res, userCollection, callback) => {
  const deviceId = req.params.deviceId ? req.params.deviceId : utils.getRandomIntInclusive(128732, 2904895230);
  if (!callback) {
    return userCollection.createUser(deviceId);
  }
  return callback(userCollection.createUser(deviceId));
};

const connect = (db, user, socket) => {
  user.socket = socket;
  db.users.mapUserIdToSocketId(user.socket.id, user.userId);
  return user;
};

const unexpectedDisconnect = (db, socket) => {
  // console.log('This socket unexpectedly disconnected:', socket.id);
  // console.log(`There were ${db.users.users.size} users in the db`);
  // console.log('The socket is active in rooms: ', socket.rooms);
  // const userId = db.users.getBySocketId(socket.id);
  // console.log(`This is the user ID ${userId}`);
  // const user = db.users.getOne(userId);
  // console.log(`This is the user ${db.users.getOne(userId)}`)
  // for (let room in socket.rooms) {
  //   gameController.handlePlayerLeave(db, socket.rooms.room, user.userId);
  // }
  // socket.disconnect();
  // db.users.destroy(user.userId);
  // console.log(`There are now ${db.users.users.size} users in the db`);
}

const destroy = (db, userId) => {
  const user = get(db.users, userId);
  if (user.socket) {
    console.log('This socket is disconnecting:', user.socket.id);
    console.log('The socket is active in rooms: ', user.socket.rooms);
    for (var room in user.socket.rooms) {
      if (typeof room === 'number') {
        gameController.handlePlayerLeave(db.games, user.socket.rooms.room, userId);
      }
    }
    user.socket.disconnect();
  }
  db.users.destroy(userId);
};

module.exports = { get, create, connect, destroy, unexpectedDisconnect };
