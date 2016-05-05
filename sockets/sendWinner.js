const dummy = require('./dummySocketData.js');

/**
 * This function sends a clue message to all the members of a room through sockets.
 * When this action is received on the client, it will be dispatched by redux automatically.
 * @param {Object} io - this is the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} user - the user for the particular socket
 * @example <caption>The action emitted:</caption>
 * let action = {
 *   type: 'SOCKET_DECLARE_WINNER',
 *   userid: 5,
 * };
 */
const sendWinner = (io, socket, user) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_DECLARE_WINNER',
    userid: dummy.user.id,
  });
};

module.exports = sendWinner;

