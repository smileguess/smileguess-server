const dummy = require('./dummySocketData.js');

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
const sendGuessMessage = (io, socket, action) => {
  console.log('sending guess message');
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_GUESS_MESSAGE',
    userid: dummy.user.id,
    message: dummy.message,
  });
};

module.exports = sendGuessMessage;

