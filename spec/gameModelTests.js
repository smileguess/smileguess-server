// Express/io required for creating some models
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const ioCreate = require('socket.io');

const Game = require('../models/Game.js');
const User = require('../models/User');

describe('Game model', () => {
  const game = new Game(1, ioCreate.listen(server));
  const maxSeats = game.seatsOpen;
  const user = new User(1, 'fake-device-id');
  it('should instantiate with correct values', () => {
    expect(typeof game).toBe('object');
    expect(game.id).toBe(1);
    expect(game.seatsOpen).toBeGreaterThan(0);
    expect(game.dealerId).toBeNull();
    expect(game.active).toBe(false);
  });
  it('can add a user', () => {
    spyOn(game, 'trigger').and.callThrough();
    game.addPlayer(user);
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'playerJoin')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'playerChange')).toBeTruthy();
    expect(game.seatsOpen).toBe(maxSeats - 1);
    expect(game.players.all[1]).toEqual(user.summary());
    expect(game.players.byId.length).toBe(1);
  });
  it('can remove a user', () => {
    spyOn(game, 'trigger').and.callThrough();
    game.removePlayer(user.userId);
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'playerLeave')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'playerChange')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'empty')).toBeTruthy();
    expect(game.seatsOpen).toBe(maxSeats);
    expect(game.players.byId.indexOf('1')).toBe(-1);
    expect(game.players.byId.length).toBe(0);
  });
  it('should get a prompt with getPrompt', () => {
    const game2 = new Game(2, ioCreate.listen(server));
    spyOn(game2, 'trigger').and.callThrough();
    expect(game2.prompt.category).toBeNull();
    expect(game2.prompt.forDisplay).toBeNull();
    expect(game2.prompt.forMatching).toBeNull();
    expect(game2.getPrompt()).toBe(game2);
    expect(game2.trigger.calls.all().filter((call) => call.args[0] === 'newPrompt')).toBeTruthy();
    expect(game2.prompt.category).toBeTruthy();
    expect(game2.prompt.forDisplay).toBeTruthy();
    expect(game2.prompt.forMatching).toBeTruthy();
  });
  it('should check a guess with checkGuess', () => {
    spyOn(game, 'trigger').and.callThrough();
    expect(game.checkGuess({
      body: 'notagoodguess',
      userId: 1,
    })).toBe(false);
    expect(game.checkGuess({ body: game.prompt.forDisplay })).toBe(game);
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'playerWon')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'newDealer')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'newPrompt')).toBeTruthy();
  });
  it('should assign a new dealer with newDealer and change prompt', () => {
    const otherUser = new User(2, 'fake-device-id-2');
    game.addPlayer(otherUser);
    const oldPrompt = game.prompt.forDisplay;
    spyOn(game, 'trigger').and.callThrough();
    expect(game.newDealer(2)).toBe(game);
    expect(game.dealerId).toBe(2);
    expect(game.prompt.forDisplay).not.toBe(oldPrompt);
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'newDealer')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'newPrompt')).toBeTruthy();
  });
  it('should trigger "full" action when adding max players', () => {
    spyOn(game, 'trigger').and.callThrough();
    while (game.players.byId.length < maxSeats) {
      game.addPlayer(new User(game.players.byId.length + 2, 'fake-user-id-bulk'));
      // Sanity check
      expect(game.players.byId.length).toBeLessThan(100);
    }
    expect(game.active).toBe(true);
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'full')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'activityStatus')).toBeTruthy();
  });
  it('should trigger "nowAvailable" action when removing a player', () => {
    spyOn(game, 'trigger').and.callThrough();
    game.removePlayer(2);
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'nowAvailable')).toBeTruthy();
    expect(game.trigger.calls.all().filter((call) => call.args[0] === 'activityStatus')).toBeTruthy();
  });
});

