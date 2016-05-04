const dummy = require('./dummySocketData.js');

module.exports = (io, socket, user) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_USER_LEAVE_GAME',
    user: dummy.user,
  });
  socket.leave(dummy.gameId);
};

