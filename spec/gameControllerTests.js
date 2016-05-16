const express = require('express');
const app = express();
const server = require('http').createServer(app);
const ioCreate = require('socket.io');

const settings = require('../config/gameSettings');
const Games = require('../collections/Games.js');
const User = require('../models/User.js');
const GameController = require('../controllers/GameController.js');

describe('Game Controller', () => {
  const games = new Games(ioCreate.listen(server));
  let testGame1;
  let testGame2;
  
  it('will place triggers on game when calling play', (done) => {
    GameController.play(games, (game) => {
      testGame1 = game;
      expect(game.events['newPrompt']).toBeDefined();
      expect(game.events['newDealer']).toBeDefined();
      expect(game.events['playerLeave']).toBeDefined();
      expect(game.events['playerJoin']).toBeDefined();
      expect(game.events['playerWon']).toBeDefined();
      done();
    });
  });
  it('will place users in the game at front of queue', () => {
    GameController.handlePlayerJoin(games, new User(1, 'fake-device-id'), testGame1.id);
    expect(testGame1.players.all[1].userId).toBe(1);
  });
  it('will create a new game if no seats are available', (done) => {
    let id = 9;
    while(testGame1.players.byId.length < settings.maxPlayers) {
      GameController.handlePlayerJoin(games, new User(++id, 'fake-device-id-2'), testGame1.id);
    }
    expect(games.fullGames.length).toBe(1);
    expect(games.openGames.length).toBe(0);
    GameController.play(games, (game) => {
      expect(game.id).not.toBe(testGame1.id);
      expect(games.openGames.length).toBe(1);
      testGame2 = game;
      done();
    });
  });
  it('will remove a player from a game', () => {
    GameController.handlePlayerJoin(games, new User(2, 'fake-device-id-2'), testGame2.id);
    GameController.handlePlayerJoin(games, new User(3, 'fake-device-id-2'), testGame2.id);
    const numPlayers = testGame1.players.byId.length;
    GameController.handlePlayerLeave(games, 2, 2);
    expect(testGame2.players.byId.length).toBe(1);
  });
  it('will destroy the game if all players leave', () => {
    GameController.handlePlayerLeave(games, 2, 3);
    expect(games.openGames.length).toEqual(0);
    expect(games.retrieve(games.openGames[0])).toBe(undefined);
  });
});

