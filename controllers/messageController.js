const Messages = require('../collections/Messages');

const create = (details) => {
  if (!details.type) {
    if (Array.isArray(details.message)) {
      details.type = 'clue';
    } else {
      details.type = 'guess';
    }
  }
  return Messages.create(details);
};

const send = (gameId, messageAction) => {
  game.io.to(gameId).emit('action', messageAction);
};

module.exports = create, send;
