const Chance = require('chance');
const chance = new Chance();
const utils = require('../utils');


module.exports = class User {
    /**
   * Instantiates new users
   * @params {string} - a unique string identifying a user
   */
  constructor(identifier) {
    this.id = identifier;
    this.username = chance.word({ syllables: utils.getRandomIntInclusive(2, 3) });
  }
};
