const createGameChangeAction = (event, game) => {
  const actionType = 'UPDATE_GAME_STATE';
  const gameActions = {
    newDealer: {
      type: actionType,
      payload: {
        dealerId: game.dealerId,
      },
    },
    playerChange: {
      type: actionType,
      payload: {
        players: game.players,
      },
    },
    newPrompt: {
      type: actionType,
      payload: {
        prompt: {
          category: game.prompt.category,
          forDisplay: game.prompt.forDisplay,
        },
      },
    },
    activityStatus: {
      type: actionType,
      payload: {
        active: game.active,
      },
    },
  };
  return gameActions[event];
};

const createMemoAction = (message) => ({
  type: 'GAME_MEMO',
  payload: {
    body: message,
  },
});

const createMessageAction = (messagePayload, messageCollection) => ({
  type: 'ADD_MESSAGE',
  payload: messageCollection.create(messagePayload),
});

module.exports = {
  createGameChangeAction,
  createMemoAction,
  createMessageAction,
};
