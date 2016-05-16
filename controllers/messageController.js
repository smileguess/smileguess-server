const create = (details, messageCollection) => {
  if (!details.type) {
    if (Array.isArray(details.message)) {
      details.type = 'clue';
    } else {
      details.type = 'guess';
    }
  }
  return messageCollection.create(details);
};

const send = (game, messageAction) => {
  game.io.to(game.id).emit('action', messageAction);
};

module.exports = {
  create,
  send
};

