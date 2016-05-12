const Chance = require('chance');
const chance = new Chance();
const utils = require('../utils');


module.exports = class User {
    /**
   * Instantiates new users
   * @params {string} - a unique string identifying a user
   */
  constructor(userId, deviceId) {
    this.userId = userId;
    this.deviceId = deviceId;
    this.username = chance.word({ syllables: utils.getRandomIntInclusive(2, 3) });
    this.socket = null;
    this.points = 0;
    this.wins = 0;
    this.emojicoins = 0;
    this.picture = '';
  }
};
