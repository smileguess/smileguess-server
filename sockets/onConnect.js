const dummy = require('./dummySocketData.js');

module.exports = (socket) => {
  console.log('Connected to Socket');
  socket.join(dummy.gameId);
};

