const dummy = require('./dummySocketData.js');

/**
 * The onDisonnect function is used to clean up a users connection to a game 
 * @param {Object} io - this is the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} user - the user model for the user
 */
const onDisconnect = (io, socket, user) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_USER_LEAVE_GAME',
    user: dummy.user,
  });
  socket.leave(dummy.gameId);
};

module.exports = onDisconnect;

