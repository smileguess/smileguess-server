const gamePlaySettings = {
  /**
  * Minimum viable numbers to start a game
  * @type {number}
  */
  minPlayers: 1,
  /**
  * Maximum number of players allowed in a game
  * @type {number}
  */
  maxPlayers: 6,
  /**
  * Regex defining which characters should not be considered in evaluating a guess
  * @type {RegEx<object>}
  */
  charsToAvoid: /-/g,
  /**
  * Number of round wins needed to win a game
  * @type {number}
  */
  roundsToWin: 2,


  emojicoinsOnGameWin: 79,

  emojicoinsOnRoundWin: 44,
};

module.exports = gamePlaySettings;
