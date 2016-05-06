const Game = require('../models/Game');
const User = require('../models/User');
const settings = require('../gameSettings');

module.exports = class Games {
  constructor() {
    this.fullGames = [];
    this.openGames = [];
    this.allTimeGameCount = 0;
  }

  createGame(firstPlayer) {
    const gameId = this.generateGameId();
    const newGame = new Game(firstPlayer, gameId);
    this.updateGameAvailability(newGame);
    return newGame;
  }

  generateGameId() {
    this.allTimeGameCount++;
    const gameId = `game${this.allTimeGameCount}`;
    return gameId;
  }

  sort() {
    this.openGames.sort((game1, game2) => game1.seatsOpen > game2.seatsOpen);
  }

  flushOpenGames() {
    this.openGames = [];
  }

  flushFullGames() {
    this.fullGames = [];
  }

  updateGameAvailability(game) {
    // if there are no seats available, push games to full games
    if (!game.seatsOpen && this.fullGames.indexOf(game) === -1) {
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
      this.sort();
    }
  }

  joinOrStartGame(req, res) {
    const open = this.openGames;
    const player = new User(req.params.userId);
    if (open.length > 0) {
      res.json(gameMethods.handlePlayerJoin(this, player));
    } else {
      res.json(this.createGame(player));
    }
  }

  dequeue() {
    return this.openGames.pop();
  }

  lastInQueue() {
    return this.openGames[this.openGames.length - 1];
  }

  retrieve(gameId) {
    let target = null;
    for (let i = 0; i < this.openGames.length; i++) {
      if (this.openGames[i].gameId === gameId) {
        target = this.openGames[i];
        this.openGames.splice(i, 1);
        return target;
      }
    }
    for (let i = 0; i < this.fullGames.length; i++) {
      if (this.fullGames[i].gameId === gameId) {
        target = this.fullGames[i];
        this.fullGames.splice(i, 1);
      }
    }
    return target;
  }
};
