const actionCreators = require('./actionCreators.js');

const sendGameChange = (event, game) => {
  const action = actionCreators.createGameChangeAction(event, game);
  game.io.emit('action', action);
};
module.exports = sendGameChange;

