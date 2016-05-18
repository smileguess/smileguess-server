const onConnect = require('../sockets/onConnect');
const onDisconnect = require('../sockets/onDisconnect');
const joinGame = require('../sockets/joinGame');
const messageController = require('../controllers/messageController');


module.exports = (io, db) => {
  io.on('connection', (socket) => {
    onConnect(io, socket);
    socket.on('disconnect', () => {
      onDisconnect(io, socket);
    });
    socket.on('action', (action) => {
      switch (action.type) {
        case 'server/sendMessage':
          return messageController.fieldMessage(db.games, action.payload);
        case 'server/joinGame':
          return joinGame(io, socket, action, db);
        default:
          return null;
      }
    });
  });
};

