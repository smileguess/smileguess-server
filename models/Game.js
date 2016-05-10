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
  constructor(userWhoStartsGame, gameId) {
    /**
    * Game identifier
    * @type {number}
    */
    this.gameId = gameId;
    /**
     * Collection of user instances in the game
     * @type {object[ ]}
     */
    this.players = [userWhoStartsGame];
    /**
    * Current number of available seats in the game
    * @type {number}
    */
    this.seatsOpen = settings.maxPlayers - 1;
    /**
    * Specifies which player is currently creating clues with emojis
    * @type {object}
    */
    this.dealer = null;
    /**
    * Defines the "solution" that the "dealer"
    * must communicate via emojis
    * @type {string}
    */
    this.solutionForDisplay = null;
    /**
    * Prevents correct answers from being deemed
    * incorrect due to capitilization, spacing, special characters, etc.
    * @type {string}
    */
    this.solutionForMatching = null;
    /**
    * Communicates the solution's category to all players
    * @type {string}
    */
    this.category = null;
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
  }
  /**
   * Adds event listeners
   * @param {string} event - an event name
   * @param {function} gameId - a function to invoke upon an event
   */
  on(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }
  /**
   * Triggers a callback associated with a given event
   * @param {string} - an event name
   */
  trigger(event, ...args) {
    // const args = Array.from(arguments).slice(1);
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback.apply(null, args);
      });
    }
  }
  /**
   * Modifies the number of available seats in the game
   */
  updateOpenSeats() {
    this.seatsOpen = settings.maxPlayers - this.players.length;
    if (this.seatsOpen === 0) {
      return this.trigger('full', this.gameId);
    }
    if (this.seatsOpen === settings.maxPlayers) {
      return this.trigger('empty', this.gameId);
    }
    this.trigger('change', this.gameId, this.seatsOpen);
    return this;
  }
  /**
   * Removes a player from the game
   * @params {object} - a user instance
   */
  removePlayer(user) {
    this.players.splice(this.players.indexOf(user), 1);
    this.updateOpenSeats();
    return this;
  }
  /**
   * Adds a player to the game
   * @params {object} - a user instance
   */
  addPlayer(user) {
    if (this.players.length < settings.maxPlayers) {
      this.players.push(user);
    } else {
      console.log('Error: Game full');
    }
    this.updateOpenSeats();
    if (!this.active && this.players.length >= settings.minPlayers) {
      this.active = true;
      this.assignFirstDealer();
      this.getSolution();
    }
    return this;
  }
  /**
   * Randomly assigns a dealer at the start of a game
   */
  assignFirstDealer() {
    this.dealer = this.players[random(1, this.players.length) - 1];
  }
  /**
   * Randomly chooses a world or phrase to be guessed
   */
  getSolution() {
    const categoryNumber = random(0, solutions.solutionsForDisplay.length - 1);
    const solutionNumber = random(0, solutions.solutionsForDisplay[categoryNumber].length - 1);
    this.solutionForDisplay = solutions.solutionsForDisplay[categoryNumber][solutionNumber];
    this.solutionForMatching = solutions.simplifiedSolutions[categoryNumber][solutionNumber];
  }
  /**
   * Checks messages for correct guesses
   * @params {object} - an object containing a message and a reference to the sender
   */
  checkGuess(message) {
    if (utils.simplifyString(message.message) === this.solutionForMatching) {
      this.handleDealerChange(message.userid);
      return true;
    }
    return false;
  }
  /**
   * Assigns the next dealer as the correct guesser
   * @params {string} - the user id of the next dealer
   */
  handleDealerChange(userid) {
    this.dealer = userid;
    this.getSolution();
    return this.dealer;
  }
};
