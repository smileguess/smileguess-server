const settings = require('../gameSettings');
// const gameMethods = require('../controllers/GameController');
// const Games = require('../collections/Games');
const utils = require('../utils');
const solutions = require('../solutions');


const random = utils.getRandomIntInclusive;
// console.log(fullGames, openGames);
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
   */
  constructor(userWhoStartsGame) {
    /**
    * @type {number}
    */
    this.gameId = null;
    /**
    * @type {number}
    */
    this.socketId = null;
    /**
     * @type {object[ ]}
     */
    this.players = [userWhoStartsGame];
    /**
    * @type {number}
    */
    this.seatsOpen = settings.maxPlayers - 1;
    /**
    * @type {object}
    */
    this.dealer = null;
    /**
    * This property defines the "solution" that the "dealer"
    * must communicate via emojis
    * @type {string}
    */
    this.solutionForDisplay = null;
    /**
    * This property prevents correct answers from being deemed
    * incorrect due to capitilization, special characters, etc.
    * @type {string}
    */
    this.solutionForMatching = null;
    /**
    * This property will communicate the solution's category to all players
    * @type {string}
    */
    this.category = null;
    /**
    * This property will prevent the game from running until sufficient players have joined
    * @type {boolean}
    */
    this.active = false;

    // in the future, we may want to add a clue property, referring to the dealer's emoji's
  }

  updateOpenSeats() {
    this.seatsOpen = settings.maxPlayers - this.players.length;
  }

  removePlayer(user) {
    this.players.splice(this.players.indexOf(user), 1);
    this.updateOpenSeats();
    // this.updateGameAvailability(this);
  }

  addPlayer(user) {
    if (this.players.length < settings.maxPlayers) {
      this.players.push(user);
    } else {
      console.error('Error: Game full');
    }
    this.updateOpenSeats();
    // this.updateGameAvailability(this);
    if (!this.active && this.players.length >= settings.minPlayers) {
      this.active = true;
      this.assignFirstDealer();
      this.getSolution();
    }
  }

  // updateGameAvailability() {
  //   if (this.seatsOpen === 0 && fullGames.indexOf(this) === -1) {
  //     fullGames.push(this);
  //     openGames.splice(openGames.indexOf(this), 1);
  //   } else if (this.seatsOpen === settings.maxPlayers) {
  //     openGames.splice(openGames.indexOf(this), 1);
  //   } else if (openGames.indexOf(this) === -1) {
  //     // console.log('game not found', 'number of available games: ', Games.openGames.length);
  //     openGames.push(this);
  //     // console.log('after pushing, open games: ', Games.openGames);
  //     const gameLoc = fullGames.indexOf(this);
  //     if (gameLoc !== -1) {
  //       fullGames.splice(gameLoc, 1);
  //     }
  //   }
  // }

  assignFirstDealer() {
    this.dealer = this.players[random(1, this.players.length) - 1];
  }

  getSolution() {
    const categoryNumber = random(0, solutions.solutionsForDisplay.length - 1);
    const solutionNumber = random(0, solutions.solutionsForDisplay[categoryNumber].length - 1);
    this.solutionForDisplay = solutions.solutionsForDisplay[categoryNumber][solutionNumber];
    this.solutionForMatching = solutions.simplifiedSolutions[categoryNumber][solutionNumber];
  }

  checkGuess(message) {
    const simplifiedGuess = utils.simplifyString(message.messageBody);
    if (simplifiedGuess === this.solutionForMatching) {
      this.handleDealerChange(message.user);
    }
  }

  handleDealerChange(user) {
    this.dealer = user;
    this.getSolution();
  }
};
