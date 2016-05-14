const onConnect = require('../sockets/onConnect.js');
const onDisconnect = require('../sockets/onDisconnect.js');
const sendMessage = require('../sockets/sendMessage.js');
const joinGame = require('../sockets/joinGame.js');

module.exports = (io, db) => {
  io.on('connection', (socket) => {
    onConnect(io, socket);
    socket.on('disconnect', () => {
      onDisconnect(io, socket);
    });
    socket.on('action', (action) => {
      switch (action.type) {
        case 'server/sendMessage':
          return sendMessage(io, socket, action, db);
        case 'server/joinGame':
          return joinGame(io, socket, action, db);
        default:
          return null;
      }
    });
  });
};

