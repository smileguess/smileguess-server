const Game = require('../models/Game');
const settings = require('../gameSettings');

module.exports = class Games {
  constructor() {
    this.fullGames = [];
    this.openGames = [];
  }

  createGame(firstPlayer) {
    this.openGames.push(new Game(firstPlayer));
  }

  sort() {
    this.sort((game1, game2) => (
      game1.seatsOpen > game2.seatsOpen
    ));
  }

  flushOpenGames() {
    this.openGames = [];
  }

  flushFullGames() {
    this.fullGames = [];
  }

  // maybe the controller should have this method, since
  // it will be called due to a user action

  // OR MAYBE! this coule be called on an on change event wrt openGames
  updateGameAvailability(game) {
    // if there are no seats available, push games to full games
    if (!game.seatsOpen && this.fullgames.indexOf(game) === -1) {
      this.fullGames.push(game);
      this.openGames.splice(this.openGames.indexOf(game), 1);
    // if game is empty, schedule for garbage collection
    } else if (game.seatsOpen === settings.maxPlayers) {
      this.openGames.splice(this.openGames.indexOf(game), 1);
    // otherwise, queue game in openGames
    } else if (this.openGames.indexOf(game) === -1) {
      this.openGames.push(game);
      // if this game was previously full, remove it from fullGames
      const gameLoc = this.fullGames.indexOf(game);
      if (gameLoc !== -1) {
        this.fullGames.splice(gameLoc, 1);
      }
      this.openGames.sort();
    }
  }

  lastInQueue() {
    return this.openGames[this.openGames.length - 1];
  }
};
