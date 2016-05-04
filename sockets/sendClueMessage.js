const dummy = require('./dummySocketData.js');

module.exports = (io, socket, action) => {
  console.log('sending clue message');
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_CLUE_MESSAGE',
    userid: dummy.user.id,
    message: dummy.message,
  });
};

