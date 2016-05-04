const dummy = require('./dummySocketData.js');

module.exports = (io, socket, action) => {
  console.log('sending guess message');
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_GUESS_MESSAGE',
    userid: dummy.user.id,
    message: dummy.message,
  });
};

