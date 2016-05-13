const dummy = require('./dummySocketData.js');

/**
 * This function sends a clue message to all the members of a room through sockets.
 * When this action is received on the client, it will be dispatched by redux automatically.
 * @param {Object} io - this is the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} action - the action passed to the server from the client
 * @example <caption>The action emitted:</caption>
 * let action = {
 *   type: 'SOCKET_CLUE_MESSAGE',
 *   userid: 5,
 *   message: '📵🐓 🌸',
 * };
 */
const sendClueMessage = (io, socket, action) => {
  console.log('sending clue message. action:', action);
  io.to(action.gameId).emit('action', {
    type: 'SOCKET_CLUE_MESSAGE',
    userid: action.userId,
    message: action.message,
  });
};

module.exports = sendClueMessage;

