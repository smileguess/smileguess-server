const onConnect = require('../sockets/onConnect.js');
const sendGuessMessage = require('../sockets/sendGuessMessage.js');
const sendClueMessage = require('../sockets/sendClueMessage.js');

const ioCreate = require('socket.io');

module.exports = (app) => {
  const io = ioCreate.listen(app);
  io.on('connection', (socket) => {
    onConnect(socket);

    socket.on('action', (action) => {
      switch (action.type) {
        case 'server/sendGuessMessage':
          return sendGuessMessage(io, socket, action);
        case 'server/sendClueMessage':
          return sendClueMessage(io, socket, action);
        default:
          return null;
      }
    });
  });
};

