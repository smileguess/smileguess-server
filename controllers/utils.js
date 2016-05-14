const settings = require('../config/gameSettings');

module.exports = {
  getRandomIntInclusive: (min, max) => (
    Math.floor(Math.random() * (max - min + 1)) + min
  ),
  simplifyString: (string) => string.toLowerCase().replace(/[^a-z]/g, ''),
};
