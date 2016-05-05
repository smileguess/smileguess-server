const Game = require('../models/Game');

module.exports = class Games {
  /**
  * Creates a collection of games
  */
  constructor() {
    /**
    * Map for storing game instances, referenced by game ID
    * @type {map}
    */
    this.storage = new Map();
    /**
    * Collection of game ID's that are not available to join
    * @type {number[]}
    */
    this.fullGames = [];
    /**
    * Queue of game ID's that are available to join
    * @type {array[]}
    */
    this.openGames = [];
    /**
    * Counter for number of games created. Used for creating game ID's
    * @type {object}
    */
    this.allTimeGameCount = 0;
  }
  /**
   * Instantiates a new game instance
   * @params {object} - a User instance
   */
  createGame(firstPlayer) {
    const gameId = this.generateGameId();
    const newGame = new Game(firstPlayer, gameId);
    newGame.on('change', this.updateQueue.bind(this));
    newGame.on('empty', this.destroy.bind(this));
    newGame.on('full', this.moveToFullGames.bind(this));
    newGame.on('nowAvailable', this.moveToOpenGames.bind(this));
    this.insert(newGame);
    return newGame;
  }
  /**
   * Creates an identifer for a new game instance
   */
  generateGameId() {
    this.allTimeGameCount++;
    const gameId = `game_${this.allTimeGameCount}`;
    return gameId;
  }
  /**
   * Stores a game instance
   * @params {object} - an instantiation of the Game model
   */
  insert(game) {
    this.storage.set(game.gameId, game);
    this.queue(game.gameId);
    return game;
  }
  /**
   * Retrieves a game instance with a given ID
   * @params {number} - a game ID
   */
  retrieve(gameId) {
    return this.storage.get(gameId);
  }
  /**
   * Deletes a game instance
   * @params {string} - a game identifier
   */
  destroy(gameId) {
    this.storage.delete(gameId);
    this.removeGameSummary(this.openGames, gameId);
    return null;
  }
  /**
   * Queues a game in order of next available game for new players
   * @params {number} - a game ID
   */
  queue(gameId) {
    this.openGames.push(gameId);
    this.updateQueue();
  }
  /**
   * sorts games by number of seats available
   */
  updateQueue() {
    return this.openGames.sort((game1, game2) => (
      this.storage.get(game1).seatsOpen > this.storage.get(game2).seatsOpen)
    );
  }
  /**
   * Classifes a game as full
   * @params {number} - a game ID
   */
  moveToFullGames(gameId) {
    this.fullGames.push(gameId);
    this.openGames.forEach((game) => {
      this.openGames.splice(game, 1);
    });
  }
  /**
   * Queues games as seats become available
   */
  moveToOpenGames(gameId) {
    this.openGames.push(gameId);
    this.sort();
    this.fullGames.forEach((game) => {
      this.fullGames.splice(game, 1);
    });
  }
  /**
   * Removes a game summary from openGames
   * @params {array} - a collection of game summaries
   * @params {string} - a game identifier
   */
  removeGameSummary(subCollection, gameId) {
    subCollection.forEach((summary) => {
      if (summary === gameId) {
        subCollection.splice(summary, 1);
      }
    });
    return subCollection;
  }
  /**
   * Retrieves the next game referenced in the queue for adding players
   */
  getNextOpenGame() {
    return this.retrieve(this.openGames[this.openGames.length - 1]);
  }
};
