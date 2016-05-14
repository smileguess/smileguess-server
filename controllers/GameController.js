const sendGameChange = require('../sockets/sendGameChange');

module.exports = {
  /**
   * Handles the addition of a player to a selected game
   * @params {object} - a instance of the Games collection
   * @params {object} - an instance of the User model
   */
  handlePlayerJoin: (gamesCollection, user, gameId) => {
    const game = gameId ? this.retrieve(gamesCollection, gameId) : gamesCollection.getNextOpenGame();
    game.addPlayer(user);
    game.on('newPrompt', this.disseminateChange);
    game.on('newDealer', this.disseminateChange);
    game.on('playerChange', this.disseminateChange);
    return game;
  },
  /**
   * Handles a player leaving a game
   * @params {object} - a instance of the Games collection
   * @params {string} - a game ID
   * @params {object} - an instance of the User model
   */
  handlePlayerLeave: (gamesCollection, gameId, userId) => (
    gamesCollection.retrieve(gameId).removePlayer(userId)
  ),
  /**
   * Handles a user wanting to play a game. If there are available games,
   the user will be added to an ongoing game. A new game will be created
   * for the user otherwise.
   * @params {object} - a instance of the Games collection
   * @params {object} - an instance of the User model
   */
  play: (gamesCollection, callback) => {
    if (!gamesCollection.openGames.length) {
      return callback(gamesCollection.createGame());
    }
    return callback(gamesCollection.getNextOpenGame());
  },
  /**
   * Handles the judgement of a player's guesses.
   * Returns true for correct guesses, false for incorect guesses.
   * @params {object} - a instance of the Games collection
   * @params {object} - an instance of the User model
   */
  handleGuess: (gamesCollection, gameId, message) => (
    gamesCollection.retrieve(gameId).checkGuess(message)
  ),

  retrieve: (gamesCollection, gameId) => (
    gamesCollection.retrieve(gameId)
  ),

  disseminateChange: (type, game) => {
    sendGameChange.modifyClientGameState(type, game);
  },
};

