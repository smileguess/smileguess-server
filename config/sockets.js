const onConnect = require('../sockets/onConnect.js');
const onDisconnect = require('../sockets/onDisconnect.js');
const joinGame = require('../sockets/joinGame.js');


module.exports = (io, db) => {
  io.on('connection', (socket) => {
    onConnect(io, socket);
    socket.on('disconnect', () => {
      onDisconnect(io, socket);
    });
    socket.on('action', (action) => {
      switch (action.type) {
        case 'server/sendGuessMessage':
          return sendGuessMessage(io, socket, action, db);
        case 'server/sendClueMessage':
          return sendClueMessage(io, socket, action);
        case 'server/joinGame':
          return joinGame(io, socket, action, db);
        default:
          return null;
      }
    });
  });
};

