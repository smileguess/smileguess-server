const dummy = require('./dummySocketData.js');

/**
 * @desc The onConnect function is used to add a user to a game's room.
 * @param socket - the users socket connection
 */
const onConnect = (socket) => {
  console.log('Connected to Socket');
  socket.join(dummy.gameId);
};

module.exports = onConnect;

