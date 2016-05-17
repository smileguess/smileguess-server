const gameController = require('./GameController');
const actionCreators = require('../sockets/actionCreators');

const create = (details, messageCollection) => {
  return messageCollection.create(details);
};

const send = (game, messageAction) => {
  game.io.to(game.gameId).emit('action', messageAction);
};

const fieldMessage = (games, action) => {
  if (!action.payload.type) {
    if (Array.isArray(action.payload.message)) {
      action.payload.type = 'clue';
    } else {
      action.payload.type = 'guess';
      gameController.handleGuess(games, action.payload.gameId, action.payload.body);
    }
  }
  send(gameController.retrieve(games, action.gameId), actionCreators.createMessageAction(action));
};

module.exports = {
  create,
  send,
  fieldMessage,
};
