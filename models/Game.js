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
   * @param {number} userWhoStartsGame - Id of the user who is creating the game.
   */
  constructor(userWhoStartsGame) {
    /**
     * @type {number[ ]}
     */
    this.players = [userWhoStartsGame];
    /**
    * @type {number}
    */
    this.dealer = null;
    /**
    * @type {string}
    */
    this.solution = null;
    /**
    * @type {string}
    */
    this.category = null;
    /**
    * @type {string[ ]}
    */
    this.clue = [];
  }
};
