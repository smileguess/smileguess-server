const GameController = require('../controllers/GameController');

/**
 * This function sends a guess message to all the members of a room through sockets.
 * When this action is received on the client, it will be dispatched by redux automatically.
 * @param {Object} io - this is the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} action - the action passed to the server from the client
 * @example <caption>The action emitted:</caption>
 * let action = {
 *   type: 'SOCKET_GUESS_MESSAGE',
 *   userid: 5,
 *   message: 'this will blow your mind!',
 * };
 */
 // action should include type, gameId, userId, message
const sendGuessMessage = (io, socket, action, db) => {
  console.log('emitting guess message:', action);
  if (GameController.handleGuess(db.games, action.gameId, action.message)) {
    //sendWinner(io, socket, action.gameId, action.username, action.newDealer);
  }
  io.to(action.gameId).emit('action', {
    type: 'SOCKET_GUESS_MESSAGE',
    userid: action.username,
    message: action.message,
  });
};

module.exports = sendGuessMessage;

