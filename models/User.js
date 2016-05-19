const Chance = require('chance');
const chance = new Chance();
const utils = require('../controllers/utils');
const randomAvatar = require('../config/randomAvatar');

/**
 * Instantiates new users
 */
class User {
  /**
   * Constructor for instantiating new users
   * @param {number} userId - a unique user identifier determined by the Games collection
   * @param {string} deviceId - a unique identifer for a user's device
   */
  constructor(userId, deviceId) {
    /**
    * User Id
    * @type {number}
    */
    this.userId = userId;
    /**
    * Device ID
    * @type {string}
    */
    this.deviceId = deviceId;
    /**
    * Username
    * @type {string}
    */
    this.username = chance.word({ syllables: utils.getRandomIntInclusive(1, 3) });
    /**
    * Socket Connection
    * @type {object}
    */
    this.socket = null;
    /**
    * Rounds won in current game
    * @type {number}
    */
    this.roundsWon = 0;
    /**
    * Games won current room
    * @type {number}
    */
    this.gamesWon = 0;
    /**
    * Total number of emojicoins collected in all games
    * @type {number}
    */
    this.emojicoins = 0;
    /**
    * User photo/avatar
    * @type {string}
    */
    this.picture = randomAvatar();
  }

  summary() {
    return {
      id: this.userId,
      username: this.username,
      roundsWon: this.roundsWon,
      gamesWon: this.gamesWon,
      emojicoins: this.emojicoins,
      picture: this.picture,
    };
  }
}

module.exports = User;
