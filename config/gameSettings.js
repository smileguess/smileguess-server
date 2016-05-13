const gamePlaySettings = {
  /**
  * Minimum viable numbers to start a game
  * @type {number}
  */
  minPlayers: 3,
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
};

module.exports = gamePlaySettings;
