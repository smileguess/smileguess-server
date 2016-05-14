const settings = require('../config/gameSettings');
const utils = require('../controllers/utils');
const prompts = require('../config/prompts');
const random = utils.getRandomIntInclusive;

/**
 * The Game model persists data about a single game room, including players, dealer
 * and other state information. Should be instantiated when a brand new game room is
 * created, otherwise retrieved from the Games collection.
 * @example
 * const newGame = new Game(gameId, io);
 */
class Game {
  /**
   * Constructor to instantiate a new Game instance.
   * @param {number} gameId - the identifer of the new game
   * @param {object} io - the socket connection pre-limited to the game's id via io.to(gameId)
   */
  constructor(gameId, io) {
    /**
    * Game identifier
    * @type {number}
    */
    this.id = gameId;

    /**
     * Collection of user instances in the game.  This has an `all` attribute with all the players in a hash table keyed by id, and an `byId` attribute with all the players' ids in an array.
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
    * Defines the prompt that the "dealer" must communicate via emojis
    * @type {object}
    */
    this.prompt = {
      /**
      * @property {string} prompt.category Communicates the solution's category to all players
      */
      category: null,

      /**
       * @property {string} prompt.forDisplay Communicates the prompt to the dealer
       */
      forDisplay: null,

      /**
       * @property {string} prompt.forMatching Prevents correct answers from being deemed incorrect due to capitilization, spacing, special characters, etc.
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
    * @type {array}
    */
    this.events = [];

    /**
     * The io object used for sending socket messages to this game
     * @type {object}
     */
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
   * @param {string} event - an event name
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
    return this;
  }

  /**
   * Removes a player from the game
   * @params {number} userId - a user ID
   */
  removePlayer(userId) {
    const user = this.players.all[userId];
    this.trigger('playerLeave', 'playerLeave', this, user);
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
   * @params {object} user - a user model
   */
  addPlayer(user) {
    if (this.players.byId.length < settings.maxPlayers) {
      this.players.byId.push(user.userId);
      this.players.all[user.userId] = user;
    } else {
      console.log('Error: Game full');
    }
    this.trigger('playerJoin', 'playerJoin', this, user);
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
    const categoryNumber = random(0, prompts.promptsForDisplay.length - 1);
    const solutionNumber = random(0, prompts.promptsForDisplay[categoryNumber].length - 1);
    this.prompt.forDisplay = prompts.promptsForDisplay[categoryNumber][solutionNumber];
    this.prompt.forMatching = prompts.simplifiedprompts[categoryNumber][solutionNumber];
    this.trigger('newPrompt', 'newPrompt', this);
    return this;
  }

  /**
   * Checks messages for correct guesses
   * @params {object} message - an object containing a message and a reference to the sender
   */
  checkGuess(message) {
    if (utils.simplifyString(message).indexOf(this.prompt.forMatching) !== -1) {
      this.trigger('playerWon', 'playerWon', this, this.players.all[message.userId]);
      return this.newDealer(message.userId);
    }
    return false;
  }

  /**
   * Assigns the next dealer as the correct guesser
   * @params {number} userId - the user id of the next dealer
   */
  newDealer(userId) {
    this.dealerId = userId || this.players[random(1, this.players.length) - 1];
    let user = this.players.all[this.dealerId];
    this.trigger('newDealer', 'newDealer', this, user);
    this.getPrompt();
    return this;
  }

};

module.exports = Game;

