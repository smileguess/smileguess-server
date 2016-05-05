const Game = require('../models/Game');

module.exports = class Games {
  /**
  * Creates a collection of games
  */
  constructor() {
    /**
    * Collection of game ID's that are not available to join
    * @type {number[]}
    */
    this.fullGames = [];
    /**
    * Collection of game ID's that are available to join
    * @type {array[]}
    */
    this.openGames = [];
    /**
    * Counter for number of games created. Used for creating game ID's
    * @type {object}
    */
    this.allTimeGameCount = 0;
    /**
    * Hash table for storing game instances
    * @type {object[]}
    */
    this.storage = [];
    /**
    * Number of games in 'storage' hash table
    * @type {number}
    */
    this.size = 0;
    /**
    * Size of 'storage' hash table
    * @type {number}
    */
    this.storageLimit = 10;
    /**
    * Specifies whether or not the 'storage' hash table is undergoing resizing
    * @type {boolean}
    */
    this.resizing = false;
  }
  /**
   * Instantiates a new game instance
   * @params {object} - a User instance
   */
  createGame(firstPlayer) {
    const gameId = this.generateGameId();
    const newGame = new Game(firstPlayer, gameId);
    this.insert(newGame);
    newGame.on('change', this.updateQueue.bind(this));
    newGame.on('empty', this.destroyGame.bind(this));
    newGame.on('full', this.moveToFullGames.bind(this));
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
   * Deletes a game instance
   * @params {string} - a game identifier
   */
  destroyGame(gameId) {
    this.removeGame(this.openGames, gameId);
  }
  /**
   * Queues a game in order of next available game for new players
   * @params {string} - a game identifier
   * @params {number} - the number of seats available in a game
   */
  queueGame(gameId, seatsOpen) {
    this.openGames.push([gameId, seatsOpen]);
  }
  /**
   * sorts games by number of seats available
   */
  sort() {
    if (this.openGames.length > 1) {
      this.openGames.sort((game1, game2) => game1[1] > game2[1]);
    }
    return this.openGames;
  }
  /**
   * Updates the openGames queue in the event of players leaving or joining a game
   * @params {string} - a game identifier
   * @params {number} - the number of available seats in a game
   */
  updateQueue(gameId, seatsOpen) {
    this.openGames[this.gameSummaryIndex(this.openGames, gameId)][1] = seatsOpen;
    this.sort();
    return this.openGames;
  }
  /**
   * Classifes a game as full
   * @params {string} - a game identifier
   */
  moveToFullGames(gameId) {
    this.fullGames.push(gameId);
    this.removeGameSummary(this.openGames, gameId);
  }
  /**
   * Removes a game summary from openGames
   * @params {array} - a collection of game summaries
   * @params {string} - a game identifier
   */
  removeGameSummary(subCollection, gameId) {
    subCollection.forEach((summary) => {
      if (summary[0] === gameId) {
        subCollection.splice(summary, 1);
      }
    });
    return subCollection;
  }
  /**
   * Returns the index of a given game summary
   * @params {array} - a collection of game summaries
   * @params {string} - a game identifier
   */
  gameSummaryIndex(subCollection, gameId) {
    for (let i = 0; i < subCollection.length; i++) {
      if (subCollection[i][0] === gameId) {
        return i;
      }
    }
    return null;
  }
  /**
   * Retrieves the next game ID in the open games queue
   */
  getNextOpenGameId() {
    return this.openGames[this.openGames.length - 1][0];
  }
  /**
   * Retrieves the next game referenced in the queue for adding players
   */
  getNextOpenGame() {
    return this.retrieve(this.getNextOpenGameId());
  }
  /**
   * Stores a game in a hash table
   * @params {object} - an instantiation of the Game model
   */
  insert(game) {
    const gameId = game.gameId;
    const index = this.getIndexBelowMaxForKey(gameId, this.storageLimit);
    this.storage[index] = this.storage[index] || [];
    const bucket = this.storage[index];
    let pair = undefined;
    let replaced = false;
    for (let i = 0; i < bucket.length; i++) {
      pair = bucket[i];
      if (pair[0] === gameId) {
        pair[1] = game;
        replaced = true;
      }
    }
    if (!replaced) {
      bucket.push([gameId, game]);
      this.size++;
    }
    if (this.size >= this.storageLimit * 0.75) {
      this.resize(this.storageLimit * 2);
    }
    this.queueGame(gameId, game.seatsOpen);
  }
  /**
   * Retrives an instance of the Game model from storage
   * @params {string} - a game identifier
   */
  retrieve(gameId) {
    const index = this.getIndexBelowMaxForKey(gameId, this.storageLimit);
    const bucket = this.storage[index];
    let pair = undefined;
    if (!bucket) { return; }
    for (let i = 0; i < bucket.length; i++) {
      pair = bucket[i];
      if (pair && pair[0] === gameId) {
        return pair[1];
      }
    }
  }
  /**
   * Removes a game from the storage hash table and its references from the queue
   * @params {array} - a group game summaries
   * @params {string} - a game identifier
   */
  removeGame(subCollection, gameId) {
    const index = this.getIndexBelowMaxForKey(gameId, this.storageLimit);
    const bucket = this.storage[index];
    let pair = undefined;
    for (let i = 0; i < bucket.length; i++) {
      pair = bucket[i];
      if (pair[0] === gameId) {
        const value = pair[1];
        this.removeGameSummary(subCollection, gameId);
        delete bucket[i];
        this.size--;
        if (this.size <= this.storageLimit * 0.25) {
          // decrease the size of the hash table
          this.resize(this.storageLimit / 2);
        }
        return value;
      }
    }
  }
  /**
   * Resizes the 'storage' hash table
   * @params {number} - the desired hash table size
   */
  resize(newSize) {
      // collect all the pairs
    if (!this.resizing) {
      this.resizing = true;
      const pairs = [];
      for (let i = 0; i < this.storage.length; i++) {
        if (!this.storage[i]) continue;
        for (let j = 0; j < this.storage[i].length; j++) {
          if (!this.storage[i][j]) continue;
          pairs.push(this.storage[i][j]);
        }
      }
      this.storageLimit = newSize;
      this.storage = [];
      this.size = 0;
      for (let i = 0; i < pairs.length; i++) {
        this.insert(pairs[i][0], pairs[i][1]);
      }
      this.resizing = false;
    }
  }
  /**
   * Hashing function that generates integers between 0 and max - 1
   * @params {string} - the key to hash
   * @params {number} - the size of the hash table
   */
  getIndexBelowMaxForKey(str, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
      hash = Math.abs(hash);
    }
    return hash % max;
  }
};
