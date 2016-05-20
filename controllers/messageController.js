const actionCreators = require('../sockets/actionCreators');

const create = (details, messageCollection) => messageCollection.create(details);

const send = (game, messageAction) => game.io.to(game.id).emit('action', messageAction);

const fieldMessage = (games, messagePayload) => {
  messagePayload.correct = false;
  if (!messagePayload.type) {
    if (Array.isArray(messagePayload.body)) {
      messagePayload.type = 'clue';
    } else {
      messagePayload.type = 'guess';
      if (games.retrieve(messagePayload.gameId).checkGuess(messagePayload)) {
        messagePayload.correct = true;
      }
    }
  }
  send(
    games.retrieve(messagePayload.gameId),
    actionCreators.createMessageAction(messagePayload, games.messages));
};

module.exports = {
  create,
  send,
  fieldMessage,
};
