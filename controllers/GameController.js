const Game = require('../models/Game');
const Games = require('../collections/Games');

const openGames = Games.openGames;

module.exports = {
  joinOrStartGame: (user) => {
    if (openGames.length > 0) {
      openGames[openGames.length - 1].addPlayer(user);
      Games.sort(openGames);
    } else {
      const newGame = new Game(user);
      newGame.updateGameAvailability();
    }
  },
};

