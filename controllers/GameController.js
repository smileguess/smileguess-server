const Game = require('../models/Game');
const Games = require('../collections/Games');
const User = require('../models/User');

const openGames = Games.openGames;

module.exports = {
  joinOrStartGame: (req, res) => {
    const userId = req.params.userId;
    const player = new User(userId);
    if (openGames.length > 0) {
      openGames[openGames.length - 1].addPlayer(player);
      Games.sort(openGames);
      res.sendStatus(200);
    } else {
      const newGame = new Game(player);
      newGame.updateGameAvailability();
      res.sendStatus(200);
    }
  },
};

