const onConnect = require('../sockets/onConnect.js');
const onDisconnect = require('../sockets/onDisconnect.js');
const sendGuessMessage = require('../sockets/sendGuessMessage.js');
const sendClueMessage = require('../sockets/sendClueMessage.js');
const sendPlayerJoinGame = require('../sockets/sendPlayerJoinGame.js');
const sendPrompt = require('../sockets/sendPrompt');

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
          return sendPlayerJoinGame(io, socket, action, db);
        case 'server/sendPrompt':
          return sendPrompt(io, socket, action);
        default:
          return null;
      }
    });
  });
};

