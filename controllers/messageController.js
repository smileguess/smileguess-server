const actionCreators = require('../sockets/actionCreators');

const create = (details, messageCollection) => messageCollection.create(details);

const send = (game, messageAction) => game.io.to(game.id).emit('action', messageAction);

const fieldMessage = (games, action) => {
  if (!action.payload.type) {
    if (Array.isArray(action.payload.body)) {
      action.payload.type = 'clue';
    } else {
      action.payload.type = 'guess';
      games.retrieve(action.payload.gameId).checkGuess(action.payload.body);
    }
  }
  send(
    games.retrieve(action.payload.gameId),
    actionCreators.createMessageAction(action, games.messages));
};

module.exports = {
  create,
  send,
  fieldMessage,
};
