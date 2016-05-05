const User = require('../models/User');

module.exports = {
  /**
   * Handles the addition of a player to a selected game
   * @params {object} - a instance of the Games collection
   * @params {object} - an instance of the User model
   */
  handlePlayerJoin: (collection, player) => (
    collection.getNextOpenGame().addPlayer(player)
  ),
  /**
   * Handles a player leaving a game
   * @params {object} - a instance of the Games collection
   * @params {string} - a game ID
   * @params {object} - an instance of the User model
   */
  handlePlayerLeave: (collection, gameId, player) => (
    collection.retrieve(gameId).removePlayer(player)
  ),
  /**
   * Handles a user wanting to play a game. If there are available games,
   the user will be added to an ongoing game. A new game will be created
   * for the user otherwise.
   * @params {object} - a instance of the Games collection
   * @params {object} - an instance of the User model
   */
  play: (collection, userId, callback) => {
    const player = new User(userId);
    if (!collection.openGames.length) {
      return callback(collection.createGame(player));
    }
    return callback(collection.getNextOpenGame().addPlayer(player));
  },
  /**
   * Handles the judgement of a player's guesses.
   * Returns true for correct guesses, false for incorect guesses.
   * @params {object} - a instance of the Games collection
   * @params {object} - an instance of the User model
   */
  handleGuess: (collection, gameId, message) => (
    collection.retrieve(gameId).checkGuess(message)
  ),
};

