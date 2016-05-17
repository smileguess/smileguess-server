const Chance = require('chance');
const chance = new Chance();
const utils = require('../controllers/utils');


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
    this.username = chance.word({ syllables: utils.getRandomIntInclusive(2, 3) });
    /**
    * Socket Connection
    * @type {object}
    */
    this.socket = null;
    /**
    * Points in current game
    * @type {number}
    */
    this.points = 0;
    /**
    * Wins in current game
    * @type {number}
    */
    this.wins = 0;
    /**
    * Total number of emojicoins collected in all games
    * @type {number}
    */
    this.emojicoins = 0;
    /**
    * User photo/avatar
    * @type {string}
    */
    this.picture = '';
  }

  summary() {
    return {
      id: this.userId,
      username: this.username,
      points: this.points,
      wins: this.wins,
      emojicoins: this.emojicoins,
      picture: this.picture,
    };
  }
}

module.exports = User;
