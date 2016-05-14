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

const createMemoAction = (message) => {
  return {
    type: 'GAME_MEMO',
    payload: message,
  };
};

const createSystemMessageAction = (message) => {
  return {
    type: 'UPDATE_MESSAGE_STATE',
    payload: message,
  };
};

module.exports = {
  createMemoAction,
  createGameChangeAction,
};

// UPDATE_MESSAGE_STATE
// UPDATE_GAME_STATE
// UPDATE_USER_STATE
// GAME_MEMO
