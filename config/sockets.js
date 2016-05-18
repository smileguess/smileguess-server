const onConnect = require('../sockets/onConnect');
const onDisconnect = require('../sockets/onDisconnect');
const gameController = require('../controllers/GameController.js');
const messageController = require('../controllers/messageController');
const UserController = require('../controllers/UserController');


module.exports = (io, db) => {
  io.on('connection', (socket) => {
    onConnect(io, socket);
    socket.on('disconnect', () => {
      console.log('USER DISCONNECTED');
      // This will be called even when a user intentionally disconnects
      // UserController.unexpectedDisconnect(db, socket);
    });
    socket.on('action', (action) => {
      switch (action.type) {
        case 'server/sendMessage':
          return messageController.fieldMessage(db.games, action.payload);
        case 'server/leaveGame':
          console.log('someone tried to leave');
          return gameController.handlePlayerLeave(db, action.payload.gameId, action.payload.userId);
        case 'server/joinGame':
          console.log('someone is joining the game');
          return gameController.joinGame(io, socket, action, db);
        default:
          return null;
      }
    });
  });
};


