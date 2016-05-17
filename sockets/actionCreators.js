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
          promptForDisplay: game.prompt.forDisplay,
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
exports.createGameChangeAction = createGameChangeAction;

const createMemoAction = (message) => {
  return {
    type: 'GAME_MEMO',
    payload: {
      body: message,
    },
  };
};
exports.createMemoAction = createMemoAction;

const createMessageAction = (details, messageCollection) => {
  return {
    type: 'ADD_MESSAGE',
    payload: messageCollection.create(details, messageCollection),
  };
};
exports.createMessageAction = createMessageAction;

// module.exports = {
//   createMemoAction,
//   createMessageAction,
//   createGameChangeAction,
// };

// UPDATE_MESSAGE_STATE
// UPDATE_GAME_STATE
// UPDATE_USER_STATE
// GAME_MEMO
