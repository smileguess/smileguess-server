const GameController = require('../controllers/GameController');
const UserController = require('../controllers/UserController');
/**
 * This function sends a message letting the users of a
 * game know that another user has joined.
 * @param {Object} io - the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} user - the user object of the user joining
 */
const joinGame = (io, socket, action, db) => {
  let user = action.userId ? UserController.get(db.users, action.userId) : null;
  if (!user) {
    user = UserController.create(null, null, db.users);
  }
  user.socket = socket;
  socket.join(action.gameId);
  return GameController.handlePlayerJoin(db.games, user);
};

module.exports = joinGame;
