const settings = require('../gameSettings');
const utils = require('../utils');
const solutions = require('../solutions');
const random = utils.getRandomIntInclusive;
/*
  When a user clicks 'join random game,' he or she will be put
  into an active game, if one is available. If one is not available,
  a new game will be instantiated for him or her.

  When players join the game, they are pushed into the game's 'players' array.
  A game will start when enough players are available to have a fun time. This
  variable resides in game-settings.js with a default value of 3.

  After enough players have joined to satisfy game genesis, a dealer will be
  chosen at random.

  A category will be randomly chosen, then a solution will randomly be chosen
  within that category.

  As the dealer enters or removes emojis as clues, they will be pushed and
  popped to and from the 'this.clue' array.
*/

/**
 * The Game model persists data about a single game room, including players, dealer
 * and other state information. Should be instantiated when a brand new game room is
 * created, otherwise retrieved from the Games collection.
 * @example
 * const newGame = new Game(user);
 */
module.exports = class Game {
  /**
   * Constructor to instantiate a new Game instance.
   * @param {Object} userWhoStartsGame - an instance of the user model
   * @param {number} gameId - the identifer of the new game
   */
  constructor(gameId, io) {
    /**
    * Game identifier
    * @type {number}
    */
    this.id = gameId;
    /**
     * Collection of user instances in the game
     * @type {object[ ]}
     */
    this.players = {
      all: {},
      byId: [],
    };
    /**
    * Current number of available seats in the game
    * @type {number}
    */
    this.seatsOpen = settings.maxPlayers;
    /**
    * Specifies which player is currently creating clues with emojis
    * @type {object}
    */
    this.dealerId = null;
    /**
    * Defines the prompt that the "dealer"
    * must communicate via emojis
    * @type {string}
    */
    this.prompt = {
      /**
      * Communicates the solution's category to all players
      * @type {string}
      */
      category: null,
      /**
      * Communicates the prompt to the dealer
      * @type {string}
      */
      forDisplay: null,
      /**
      * Prevents correct answers from being deemed
      * incorrect due to capitilization, spacing, special characters, etc.
      * @type {string}
      */
      forMatching: null,
    };
    /**
    * Prevents the game from running until sufficient players have joined
    * @type {boolean}
    */
    this.active = false;
    /**
    * Event listener callback functions to be invoked
    * @type {object[ ]}
    */
    this.events = [];


    this.io = io.to(this.id);

  }
  /**
   * Adds event listeners
   * @param {string} event - an event name
   * @param {function} gameId - a function to invoke upon an event
   */
  on(event, ...args) {
    this.events[event] = this.events[event] || [];
    args.forEach(callback => this.events[event].push(callback));
  }
  /**
   * Triggers a callback associated with a given event
   * @param {string} - an event name
   */
  trigger(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback.apply(null, args));
    }
  }
  /**
   * Modifies the number of available seats in the game
   */
  updateOpenSeats() {
    const wasFull = this.seatsOpen === 0;
    const gameId = this.id;
    this.seatsOpen = settings.maxPlayers - this.players.byId.length;
    this.trigger('playerChange', 'playerChange', this);
    if (this.seatsOpen === 0) {
      return this.trigger('full', gameId);
    }
    if (this.seatsOpen === settings.maxPlayers) {
      return this.trigger('empty', gameId);
    }
    if (wasFull && this.seatsOpen > 0) {
      return this.trigger('nowAvailable', gameId, this.seatsOpen);
    }
    return null;
  }
  /**
   * Removes a player from the game
   * @params {number} - a user ID
   */
  removePlayer(userId) {
    this.players.byId.splice(this.players.byId.indexOf(userId), 1);
    delete this.players.all[userId];
    this.updateOpenSeats();
    if (this.players.byId.length < settings.minPlayers) {
      this.active = false;
    }
    return this;
  }
  /**
   * Adds a player to the game
   * @params {number} - a user ID
   */
  addPlayer(user) {
    if (this.players.byId.length < settings.maxPlayers) {
      this.players.byId.push(user.userId);
      this.players.all[user.userId] = user;
    } else {
      console.log('Error: Game full');
    }
    this.updateOpenSeats();
    if (!this.active && this.players.byId.length >= settings.minPlayers) {
      this.active = true;
      this.trigger('activityStatus', 'activityStatus', this);
      this.newDealer();
      this.getPrompt();
    }
    return this;
  }
  /**
   * Randomly chooses a world or phrase to be guessed
   */
  getPrompt() {
    const categoryNumber = random(0, solutions.solutionsForDisplay.length - 1);
    const solutionNumber = random(0, solutions.solutionsForDisplay[categoryNumber].length - 1);
    this.prompt.forDisplay = solutions.solutionsForDisplay[categoryNumber][solutionNumber];
    this.prompt.forMatching = solutions.simplifiedSolutions[categoryNumber][solutionNumber];
    this.trigger('newPrompt', 'newPrompt', this);
  }
  /**
   * Checks messages for correct guesses
   * @params {object} - an object containing a message and a reference to the sender
   */
  checkGuess(message) {
    if (utils.simplifyString(message) === this.prompt.forMatching) {
      return this.newDealer(message.userId);
    }
    return false;
  }
  /**
   * Assigns the next dealer as the correct guesser
   * @params {string} - the user id of the next dealer
   */
  newDealer(userId) {
    this.dealerId = userId || this.players[random(1, this.players.length) - 1];
    this.trigger('newDealer', 'newDealer', this);
    this.getPrompt();
    return this.dealerId;
  }
};

