const Chance = require('chance');
const chance = new Chance();

const getRandomIntInclusive = (min, max) => (
  Math.floor(Math.random() * (max - min + 1)) + min
);

module.exports = class User {
  constructor(identifier) {
    this.id = identifier;
    this.username = chance.word({ syllables: getRandomIntInclusive(2, 3) });
  }
};
