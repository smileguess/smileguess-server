const reporter = require('./support/reporter');
const request = require('request');
const Users = require('../collections/Users');
const Games = require('../collections/Games.js');
const GameController = require('../controllers/GameController');
const UserController = require('../controllers/UserController');
const settings = require('../config/gameSettings');
const testUtils = require('./testUtils');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const ioCreate = require('socket.io');
jasmine.getEnv().addReporter(reporter);

const serverURL = 'http://127.0.0.1:1234';

let testDb = {
  games: new Games(ioCreate.listen(server)),
  users: new Users(),
};

describe('Server Functions', () => {
  describe('API', () => {
    it('will respond to a request at a nonexistant endpoint', (done) => {
      const options = {
        method: 'GET',
        uri: serverURL,
      };
      request(options, (error, res) => {
        if (error && error.code === 'ECONNREFUSED') {
          throw new Error('Connection refused, are you sure your server is running?');
        }
        expect(res.statusCode).toBe(404);
        done();
      });
    });
    it('will respond with a game instance', (done) => {
      testUtils.sendPlayRequest(null, (err, res, body) => {
        const game = JSON.parse(body);
        expect(game.hasOwnProperty('id')).toBe(true);
        expect(game.hasOwnProperty('players')).toBe(true);
        done();
      });
    });
    it('will respond with a user instance', (done) => {
      testUtils.sendUserRequest(null, (err, res, body) => {
        const user = JSON.parse(body);
        expect(user.hasOwnProperty('userId')).toBe(true);
        done();
      });
    });
  });
});

describe('Models, Collections and Controllers: ', () => {
  beforeEach(() => {
    testDb = {
      games: new Games(ioCreate.listen(server)),
      users: new Users(),
    };
  });

  describe('User Model', () => {
    it('will correctly instantiate a new user', () => {
      expect(testDb.users.createUser('hypotheticalDeviceId').userId).toBe(1);
      expect(UserController.get(testDb.users, 1).username).not.toBe(undefined);
    });
  });

  describe('Game Model', () => {
    it('will correctly instantiate a new game', () => {
      testDb.games.createGame();
      expect(testDb.games.getNextOpenGame().hasOwnProperty('id')).toBe(true);
      expect(testDb.games.getNextOpenGame().hasOwnProperty('players')).toBe(true);
      expect(testDb.games.getNextOpenGame().hasOwnProperty('seatsOpen')).toBe(true);
      expect(testDb.games.getNextOpenGame().hasOwnProperty('dealerId')).toBe(true);
      expect(testDb.games.getNextOpenGame().hasOwnProperty('events')).toBe(true);
    });

    it('will place a player in a game', () => {
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, 2)
      console.log(testDb.games.getNextOpenGame().players.all['1'].userId);
      expect(testDb.games.getNextOpenGame().players.byId[0]).toEqual(1);
      expect(testDb.games.getNextOpenGame().players.all['1'].userId).toEqual(1);
      expect(testDb.games.getNextOpenGame().players.byId[1]).toEqual(2);
      expect(testDb.games.getNextOpenGame().players.all['2'].userId).toEqual(2)
    });
    it('will remove a player from a game', () => {
      const testGame = testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, 2)
      expect(testGame.players.byId.length).toEqual(2);
      expect(Object.keys(testGame.players.all).length).toEqual(2);


      GameController.handlePlayerLeave(testDb.games, 1, 1);
      expect(testGame.players.byId.length).toBe(1);
      expect(Object.keys(testGame.players.all).length).toEqual(1);

    });
    it('will adjust the number of seats available after adding players', () => {
      const testGame = testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, 1);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 1);

      testUtils.populateNextOpenGameWithPlayers(testDb, 1);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - testGame.players.byId.length);
    });
    it('will adjust the number of seats available after removing players', () => {
      const testGame = testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, 2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 2);

      GameController.handlePlayerLeave(testDb.games, 1, 2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 1);
    });
    it('will start a game after enough players have joined', () => {
      const testGame = testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.minPlayers - 1);
      expect(testDb.games.getNextOpenGame().active).toBe(false);

      testUtils.populateNextOpenGameWithPlayers(testDb, 1);
      expect(testDb.games.getNextOpenGame().active).toBe(true);
    });
    it('will assign the first dealer', () => {
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.minPlayers);
      expect(testDb.games.openGames[0].dealer).not.toBe(null);
    });
    it('will assign a random prompt from a random category', () => {
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.minPlayers);
      expect(testDb.games.retrieve(1).prompt.forDisplay).not.toBe(null);
      expect(testDb.games.retrieve(1).prompt.forMatching).not.toBe(null);
    });
    it('will check guesses', () => {
      const testGuess = {
        type: 'SOCKET_GUESS_MESSAGE',
        userid: 'user1ID',
        message: 'NOT A CORRECT GUESS',
      };
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.minPlayers);
      expect(GameController.handleGuess(testDb.games, 1, testGuess.message)).toBe(false);

      prompt = testDb.games.getNextOpenGame().prompt.forMatching.toLowerCase();
      console.log(prompt);
      expect(GameController.handleGuess(testDb.games, 1, prompt)).not.toBe(false);
    });
  });

  describe('Game Collection', () => {
    it('will retrieve a game by game id', () => {
      // testDb.games.createGame();
      // expect(testDb.games.retrieve(1)).not.toBe(undefined);
    });
    it('will quarantine full games', () => {
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.maxPlayers - 1);
      expect(testDb.games.fullGames.length).toEqual(0);

      GameController.handlePlayerJoin(testDb.games, testUtils.generateTestUsers(testDb.users, 1)[0].userId);
      expect(testDb.games.fullGames.length).toEqual(1);
    });
    it('will aggregate games with seats available', () => {
      testDb.games.createGame();
      testDb.games.createGame();
      expect(testDb.games.openGames.length).toEqual(2);
    });
    it('will move games from openGames to fullGames when they are full', () => {
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.maxPlayers - 1);
      expect(testDb.games.fullGames.length).toEqual(0);
      GameController.handlePlayerJoin(testDb.games, testUtils.generateTestUsers(testDb.users, 1)[0].userId);
      expect(testDb.games.fullGames.length).toEqual(1);
      expect(testDb.games.openGames.length).toEqual(0);
    });
    it('will move games from fullGames to openGames when a seat becomes available', () => {
      testDb.games.createGame();
      expect(testDb.games.fullGames.length).toEqual(0);
      testUtils.populateNextOpenGameWithPlayers(testDb, settings.maxPlayers);
      expect(testDb.games.fullGames.length).toEqual(1);
    });
    it('will order open games by number of seats available', () => {
      testDb.games.createGame();
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, 3);

      expect(testDb.games.retrieve(testDb.games.openGames[0]).seatsOpen).toEqual(4);
      expect(testDb.games.retrieve(testDb.games.openGames[1]).seatsOpen).toEqual(5);
    });
    it('will place users in the game with the most seats available', () => {
      testDb.games.createGame();
      testDb.games.createGame();
      testUtils.populateNextOpenGameWithPlayers(testDb, 4);
      expect(testDb.games.openGames[0][1]).toEqual(testDb.games.openGames[1][1]);
    });
    it('will create a new game if no seats are available', () => {
      GameController.play(testDb.games, (game) => {
        testUtils.populateNextOpenGameWithPlayers(testDb, 1, null);
        expect(game.players.byId[0]).toEqual(1);
      });
    });
    it('will destroy the game if all players leave', () => {
      testDb.games.createGame();
      expect(testDb.games.openGames.length).toEqual(1);
      expect(typeof testDb.games.retrieve(testDb.games.openGames[0])).toBe('object');
      GameController.handlePlayerLeave(testDb.games, 1, 1);
      expect(testDb.games.openGames.length).toEqual(0);
      expect(testDb.games.retrieve(testDb.games.openGames[0])).toBe(undefined);
    });
  });
});

module.exports = {

};
