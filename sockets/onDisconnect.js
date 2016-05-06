const dummy = require('./dummySocketData.js');

/**
 * The onDisonnect function is used to clean up a users connection to a game 
 * @param {Object} io - this is the socket.io object
 * @param {Object} socket - the users socket connection
 */
const onDisconnect = (io, socket) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_USER_LEAVE_GAME',
    userid: dummy.user.id,
  });
  socket.leave(dummy.gameId);
};
module.exports = onDisconnect;

