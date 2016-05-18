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
const sendSystemMessage = (game, messageBody, messageCollection) => {
  const payload = {
    type: 'system',
    body: messageBody,
    userId: 0,
  };
  messageController.send(game, actionCreators.createMessageAction(payload, messageCollection));
};

const disseminateChange = (event, game) => game.io.emit('action', actionCreators.createGameChangeAction(event, game));

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
const sendMemoAndSystemMessage = (game, messageBody, messageCollection) => {
  sendMemo(game, messageBody);
  sendSystemMessage(game, messageBody, messageCollection);
};

/**
 * Handles a user wanting to play a game. If there are available games,
 the user will be added to an ongoing game. A new game will be created
 * for the user otherwise.
 * @params {object} - a instance of the Games collection
 * @params {object} - an instance of the User model
 */
const play = (games, callback) => {
  let game;
  if (!games.openGames.length) {
    game = games.createGame()
      .on('newPrompt', disseminateChange)
      .on('newDealer',
        disseminateChange,
        (type, game, user) => sendMemoAndSystemMessage(game, `${user.username} is the new dealer`, games.messages))
      .on('playerChange', disseminateChange)
      .on('playerLeave', (type, game, user) => sendMemoAndSystemMessage(game, `${user.username} has left the game`, games.messages))
      .on('playerJoin', (type, game, user) => sendMemoAndSystemMessage(game, `${user.username} has joined the game`, games.messages))
      .on('playerWon', (type, game, user) => sendMemoAndSystemMessage(game, `${user.username} has won the game!`, games.messages));
  } else {
    game = games.getNextOpenGame();
  }
  return callback(game);
};

/**
 * Handles the judgement of a player's guesses.
 * Returns true for correct guesses, false for incorect guesses.
 * @params {object} - a instance of the Games collection
 * @params {object} - an instance of the User model
 */
const handleGuess = (gamesCollection, gameId, message) => {
  gamesCollection.retrieve(gameId).checkGuess(message);
};

module.exports = {
  handlePlayerJoin,
  handlePlayerLeave,
  play,
  handleGuess,
  retrieve,
  sendMemoAndSystemMessage,
  sendSystemMessage,
  sendMemo,
  disseminateChange,
};

