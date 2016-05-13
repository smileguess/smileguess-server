const socketUtils = require('./socketUtils');

exports.modifyClientGameState = (event, game) => {
  const action = socketUtils.createGameChangeAction(event, game);
  game.io.emit('action', action);
};
