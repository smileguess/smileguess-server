const onConnect = require('../sockets/onConnect.js');
const onDisconnect = require('../sockets/onDisconnect.js');
const sendGuessMessage = require('../sockets/sendGuessMessage.js');
const sendClueMessage = require('../sockets/sendClueMessage.js');
const joinRandomGame = require('../sockets/joinRandomGame.js');

const ioCreate = require('socket.io');

module.exports = (app, db) => {
  const io = ioCreate.listen(app);
  io.on('connection', (socket) => {
    onConnect(io, socket);

    socket.on('disconnect', () => {
      onDisconnect(io, socket);
    });
    socket.on('action', (action) => {
      switch (action.type) {
        case 'server/sendGuessMessage':
          return sendGuessMessage(io, socket, action);
        case 'server/sendClueMessage':
          return sendClueMessage(io, socket, action);
        case 'server/joinRandomGame':
          return joinRandomGame(io, socket, action);
        default:
          return null;
      }
    });
  });
};

