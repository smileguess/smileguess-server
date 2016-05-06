const Game = require('../models/Game');
const Games = require('../collections/Games');
const User = require('../models/User');

const openGames = Games.openGames;

module.exports = {
  joinOrStartGame: (req, res) => {
    const userId = req.params.userId;
    const player = new User(userId);
    if (openGames.length > 0) {
      console.log('THERE ARE OPEN GAMES')
      const targetGame = openGames[openGames.length - 1];
      targetGame.addPlayer(player);
      Games.sort(openGames);
      res.json(targetGame);
    } else {
      console.log('THERE ARE NO OPEN GAMES')
      const newGame = new Game(player);
      newGame.updateGameAvailability();
      console.log('OPEN GAMES: ', openGames);
      res.json(newGame);
    }
  },
  handlePlayerJoin: (collection, player) => {
    const adjustedGame = collection.dequeue().addPlayer(player);
    collection.updateGameAvailability(adjustedGame);
    return adjustedGame;
  },
  handlePlayerLeave: (collection, gameId, player) => {
    const game = collection.retrieve(gameId);
    game.removePlayer(player);
    collection.updateGameAvailability(game);
  },
};

