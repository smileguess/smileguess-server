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
      category: '⌚️  Hang tight. More players are on the way!  🚌',

      /**
       * @property {string} prompt.forDisplay Communicates the prompt to the dealer
       */
      forDisplay: '⌚️  Hang tight. More players are on the way!  🚌',

      /**
       * @property {string} prompt.forMatching Prevents correct answers from being deemed incorrect due to capitilization, spacing, special characters, etc.
       */
      forMatching: null,

      hint: '',

      hintForDisplay: '⌚️  Hang tight. More players are on the way!  🚌',

      hintLocations: {},

      hintCount: 0,

      intervalIds: [],
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
    this.io = io.to(gameId);
  }

  /**
   * Adds event listeners
   * @param {string} event - an event name
   * @param {function} gameId - a function to invoke upon an event
   */
  on(event, ...args) {
    this.events[event] = this.events[event] || [];
    args.forEach(callback => this.events[event].push(callback));
    return this;
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
    // delete this.players.all[userId];
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
      if (this.players.byId.indexOf(user.userId) < 0) {
        this.players.byId.push(user.userId);
      }
      this.players.all[user.userId] = user.summary();
    } else {
      console.log('Error: Game full');
    }
    this.trigger('playerJoin', 'playerJoin', this, user);
    this.updateOpenSeats();
    if (!this.active && this.players.byId.length >= settings.minPlayers) {
      this.active = true;
      this.trigger('activityStatus', 'activityStatus', this);
      this.newDealer();
    }
    return this;
  }

  /**
   * Randomly chooses a world or phrase to be guessed
   */
  getPrompt() {
    const categoryNumber = random(0, prompts.promptsForDisplay.length - 1);
    const solutionNumber = random(0, prompts.promptsForDisplay[categoryNumber].length - 1);
    this.prompt.category = prompts.categories[categoryNumber];
    this.prompt.forDisplay = prompts.promptsForDisplay[categoryNumber][solutionNumber];
    this.prompt.forMatching = prompts.simplifiedPrompts[categoryNumber][solutionNumber];
    setTimeout(() => this.generateHint(), settings.timeToHintStart);
    this.trigger('newPrompt', 'newPrompt', this);
    return this;
  }

  /**
   * Checks messages for correct guesses
   * @params {object} message - an object containing a message and a reference to the sender
   */
  resetHints() {
    console.log('CALLING CLEAR INTERVAL');
    clearInterval(this.prompt.intervalIds.shift());
    this.prompt.hintLocations = {};
    this.prompt.hintCount = 0;
    this.trigger('newPrompt', 'newPrompt', this);
  }

  checkGuess(messagePayload) {
    const userSummary = this.players.all[messagePayload.userId];
    if (utils.simplifyString(messagePayload.body).indexOf(this.prompt.forMatching) !== -1) {
      this.resetHints();
      userSummary.emojicoins += settings.emojicoinsOnRoundWin;
      userSummary.roundsWon++;
      if (userSummary.roundsWon >= settings.roundsToWin) {
        userSummary.gamesWon++;
        userSummary.emojicoins += settings.emojicoinsOnGameWin;
        this.players.byId.forEach((id) => {
          this.players.all[id].roundsWon = 0;
        });
        this.trigger('playerWinGame', 'playerWinGame', this, userSummary);
      } else {
        this.trigger('playerWinRound', 'playerWinRound', this, userSummary);
      }
      // what is this trigger doing here????????????????????????????????????????????????????????????????????????????????????????????????????????????
      this.trigger('playerChange', 'playerChange', this);
      return this.newDealer(messagePayload.userId);
    }
    return false;
  }


  generateHint() {
    const initializeHint = () => {
      const prompt = this.prompt.forDisplay;
      let starterHint = '';
      this.prompt.hintCount = 0;
      for (let i = 0; i < prompt.length; i++) {
        if (prompt[i] === ' ') {
          starterHint += ' ';
        } else {
          starterHint += '-';
        }
      }
      this.prompt.hint = starterHint;
      this.prompt.hintForDisplay = `${this.prompt.category}: ${this.prompt.hint}`;
      this.trigger('newPrompt', 'newPrompt', this);
    };

    const iterateHint = setInterval(() => {
      console.log('In setInterval. Hint count:', this.prompt.hintCount, '. There should be', settings.maxHints * this.prompt.forDisplay.length, 'hints given.');
      if (this.prompt.hintCount <= settings.maxHints * this.prompt.forDisplay.length) {
        this.showRandomChar();
        console.log('called show random char. Hint count:', this.prompt.hintCount);
      } else {
        this.resetHints();
      }
    }, 3000);

    initializeHint();
    this.prompt.intervalIds.push(iterateHint);
  }

  showRandomChar() {
    const prompt = this.prompt.forDisplay;
    const tempHint = this.prompt.hint.split('');
    const location = random(0, prompt.length - 1);
    if (this.prompt[location] === ' ' || this.prompt.hintLocations[location]) {
      console.log(`LOCATION ${location} ALREADY USED. HERE IS THE LOCATIONS OBJECT: ${Object.keys(this.prompt.hintLocations)}. TRYING AGAIN`)
      return this.showRandomChar();
    }
    console.log('This is the prompt:', prompt, 'This is the value given as a hint:', prompt[location]);
    this.prompt.hintLocations[location] = true;
    tempHint[location] = prompt.charAt(location);
    this.prompt.hint = tempHint.join('');
    this.prompt.hintForDisplay = `${this.prompt.category}: ${this.prompt.hint}`;
    this.prompt.hintCount++;
    this.trigger('newPrompt', 'newPrompt', this);
    return location;
  }

  /**
   * Assigns the next dealer as the correct guesser
   * @params {number} userId - the user id of the next dealer
   */
  newDealer(userId) {
    console.log('NEW DEALER CALLED')
    if (this.players.byId.length >= settings.minPlayers) {
      this.dealerId = userId ? userId : this.players.byId[random(1, this.players.byId.length) - 1];
      this.getPrompt();
      let user = this.players.all[this.dealerId];
      this.trigger('newDealer', 'newDealer', this, user);
    } else {
      this.dealerId = null;
    }
    return this;
  }

  summary() {
    return {
      id: this.id,
      players: {
        all: this.players.all,
        byId: this.players.byId,
      },
      dealerId: this.dealerId,
      prompt: {
        category: this.prompt.category,
        forDisplay: this.prompt.forDisplay,
        hintForDisplay: this.prompt.hintForDisplay,
      },
      active: this.active,
    };
  }
}

module.exports = Game;

