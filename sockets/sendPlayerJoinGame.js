const dummy = require('./dummySocketData.js');

/**
 * This function sends a message letting the users of a
 * game know that another user has joined.
 * @param {Object} io - the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} user - the user object of the user joining
 */
const sendPlayerJoinGame = (io, socket, user) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_PLAYER_JOIN_GAME',
    user: user,
  });
};
module.exports = sendPlayerJoinGame;

