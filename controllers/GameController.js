const sendGameChange = require('../sockets/sendGameChange');
const actionCreators = require('../sockets/actionCreators');
const messageController = require('./messageController');

const retrieve = (gamesCollection, gameId) =>
  gamesCollection.retrieve(gameId);
/**
 * Handles the addition of a player to a selected game
 * @params {object} - a instance of the Games collection
 * @params {object} - an instance of the User model
 */
const handlePlayerJoin = (gamesCollection, user, gameId) => (
  gameId ? retrieve(gamesCollection, gameId).addPlayer(user) : gamesCollection.getNextOpenGame().addPlayer(user)
);

/**
 * TODO: change me to match my friends :-)
 */
const disseminateChange = (type, game) =>
  sendGameChange.modifyClientGameState(type, game);
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
 * Sends a socket message as a system message
 * @params {string} message - message to send
 */
const sendSystemMessage = (game, body) => {
  const details = {
    type: 'system',
    body,
  };
  messageController.send(game.gameId, actionCreators.createSystemMessageAction(details));
};

/**
 * Sends a socket message as a memo message
 * @params {string} message - message to send
 */
const sendMemo = (game, message) =>
  game.io.emit('action', actionCreators.createMemoAction(message));

/**
 * Sends a socket message as both a message and a memo
 * @params {string} message - message to send
 */
const sendNotification = (game, message) => {
  sendMemo(game, message);
};

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
    game = gamesCollection.createGame()
      .on('newPrompt', disseminateChange)
      .on('newDealer',
        disseminateChange,
        (type, thisGame, user) => sendSystemMessage(game, `${user.username} is the new dealer`))
      .on('playerLeave', (type, thisGame, user) => sendSystemMessage(game, `${user.username} has left the game`))
      .on('playerJoin', (type, game, user) => sendSystemMessage(game, `${user.username} has joined the game`))
      .on('playerWon', (type, game, user) => sendSystemMessage(game, `${user.username} has won the game!`));
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


module.exports = {
  handlePlayerJoin,
  handlePlayerLeave,
  play,
  handleGuess,
  retrieve,
  sendNotification,
  sendSystemMessage,
  sendMemoMessage,
  disseminateChange,
};

