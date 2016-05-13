const GameController = require('../controllers/GameController');
const UserController = require('../controllers/UserController');
/**
 * This function sends a message letting the users of a
 * game know that another user has joined.
 * @param {Object} io - the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} user - the user object of the user joining
 */
const sendPlayerJoinGame = (io, socket, action, db) => {
  console.log('SOCKET_PLAYER_JOIN_GAME CALLED');

  let user = action.userId ? UserController.getUser(db.users, action.userId) : UserController.newUser(null, null, db.users);
  if (!user) {
    user = UserController.newUser(null, null, db.users);
  }
  console.log(user);
  user.socket = socket;
  GameController.handlePlayerJoin(db.games, user.userId);

  socket.join(action.gameId);
  socket.broadcast.to(action.gameId).emit('action', {
    type: 'SOCKET_PLAYER_JOIN_GAME',
    user: db.users.getOne(user.userId),
    game: GameController.retrieve(db.games, action.gameId),
  });
};

module.exports = sendPlayerJoinGame;
