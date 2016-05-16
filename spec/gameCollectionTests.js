// Express/io required for creating some models
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const ioCreate = require('socket.io');
const testUtils = require('./testUtils');

const Games = require('../collections/Games.js');
const User = require('../models/User.js');

describe('Games collection', () => {
  const games = new Games(ioCreate.listen(server));
  const testGame1 = games.createGame();
  const testGame2 = games.createGame();
  it('should initialize with correct values', () => {
    expect(games.storage).toEqual(new Map());
    expect(games.fullGames).toEqual([]);
    expect(games.openGames).toEqual([1, 2]);
    expect(games.allTimeGameCount).toEqual(2);
  });
  it('should create a game and put it in openGames', () => {
    spyOn(games, 'queue').and.callThrough();
    spyOn(games, 'updateQueue').and.callThrough();
    const testGame3 = games.createGame();

    expect(games.openGames.length).toEqual(3);
    expect(games.queue).toHaveBeenCalled();
    expect(games.updateQueue).toHaveBeenCalled();
  });
  it('should retrieve a game with retrieve', () => {
    expect(games.retrieve(1)).toBe(testGame1);
  });
  it('will put most full game at front of queue using updateQueue', () => {
    testGame2.addPlayer(new User(5, 'fake-device-id'));
    games.updateQueue();

    expect(games.openGames[0]).toEqual(testGame2.id);
    expect(games.openGames[1]).toEqual(testGame1.id);
  });
  it('should destroy a game with destroy', () => {
    spyOn(games, 'removeGameSummary').and.callThrough();
    games.destroy(1);
    expect(games.retrieve(1)).toBeUndefined();
    expect(games.removeGameSummary).toHaveBeenCalled();
  });
});
  
