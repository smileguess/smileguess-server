const sendGameChange = require('../sockets/sendGameChange');
const actionCreators = require('../sockets/actionCreators');

/**
 * Handles the addition of a player to a selected game
 * @params {object} - a instance of the Games collection
 * @params {object} - an instance of the User model
 */
const handlePlayerJoin = (gamesCollection, user, gameId) => {
  const game = gameId ? retrieve(gamesCollection, gameId) : gamesCollection.getNextOpenGame();
  game.addPlayer(user);
  return game;
};
/**
 * Handles a player leaving a game
 * @params {object} - a instance of the Games collection
 * @params {string} - a game ID
 * @params {object} - an instance of the User model
 */
const handlePlayerLeave = (gamesCollection, gameId, userId) => (
  gamesCollection.retrieve(gameId).removePlayer(userId)
);
/**
 * Handles a user wanting to play a game. If there are available games,
 the user will be added to an ongoing game. A new game will be created
 * for the user otherwise.
 * @params {object} - a instance of the Games collection
 * @params {object} - an instance of the User model
 */
const play = (gamesCollection, callback) => {
  let game;
  if (!gamesCollection.openGames.length) {
    game = gamesCollection.createGame();
    //Add callbacks and trigger for io funcs here
    // sendNotification(`${user.username} has left the game`);
    game.on('newPrompt', disseminateChange);
    game.on('newDealer',
      disseminateChange, 
      (type, game, user) => sendNotification(`${user.username} is the new dealer`)
    );
    game.on('playerLeave', (type, thisGame, user) => sendNotification(thisGame, `${user.username} has left the game`));
    game.on('playerJoin', (type, thisGame, user) => sendNotification(thisGame, `${user.username} has joined the game`));
    game.on('playerWon', (type, thisGame, user) => sendNotification(thisGame, `${user.username} has won the game!`));

  } else {
    game = gamesCollection.getNextOpenGame();
  }
  return callback(game);
};
/**
 * Handles the judgement of a player's guesses.
 * Returns true for correct guesses, false for incorect guesses.
 * @params {object} - a instance of the Games collection
 * @params {object} - an instance of the User model
 */
const handleGuess = (gamesCollection, gameId, message) => 
  gamesCollection.retrieve(gameId).checkGuess(message);

const retrieve = (gamesCollection, gameId) =>
  gamesCollection.retrieve(gameId);

/**
 * Sends a socket message as a system message
 * @params {string} message - message to send
 */
const sendSystemMessage = (game, message) => {
  game.io.emit('action', actionCreators.createMemoAction(message));
}

/**
 * Sends a socket message as a memo message
 * @params {string} message - message to send
 */
const sendMemoMessage = (game, message) => {
  game.io.emit('action', actionCreators.createMemoAction(message));
  }
/**
 * Sends a socket message as both a message and a memo
 * @params {string} message - message to send
 */
const sendNotification = (game, message) => {
  sendSystemMessage(game, message);
  sendMemoMessage(game, message);
};


/**
 * TODO: change me to match my friends :-)
 */
const disseminateChange = (type, game) =>
  sendGameChange.modifyClientGameState(type, game);

module.exports = {
  handlePlayerJoin,
  handlePlayerLeave,
  play,
  handleGuess,
  retrieve,
  sendNotification,
  sendSystemMessage,
  sendMemoMessage,
  disseminateChange
};

