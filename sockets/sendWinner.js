const dummy = require('./dummySocketData.js');

module.exports = (io, socket, user) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_DECLARE_WINNER',
    userid: dummy.user.id,
  });
};

