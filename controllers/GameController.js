const Game = require('../models/Game');
const Games = require('../collections/Games');
const User = require('../models/User');

const openGames = Games.openGames;

module.exports = {
  joinOrStartGame: (collection, userId, callback) => {
    const player = new User(userId);
    if (!collection.openGames.length) {
      return callback(collection.createGame(player));
    }
    callback(handlePlayerJoin(collection, player));
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

