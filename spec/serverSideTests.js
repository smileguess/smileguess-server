const reporter = require('./support/reporter');
const request = require('request');
const User = require('../models/User');
const Games = require('../collections/Games.js');
const GameController = require('../controllers/GameController');
const settings = require('../gameSettings');
jasmine.getEnv().addReporter(reporter);

const serverURL = 'http://127.0.0.1:1234';
const joinOrStartGameURL = 'http://127.0.0.1:1234/api/game/';

const sendPlayRequest = (deviceId, requestOptions, callback) => {
  const id = deviceId || 'defaultTestDeviceId';
  const options = requestOptions || {
    method: 'GET',
    uri: joinOrStartGameURL + id,
  };
  return request(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    return callback(err, res, body);
  });
};

const generateTestUsers = (n) => {
  const testUsers = [];
  for (let i = 1; i <= n; i++) {
    testUsers.push(new User(`autoGeneratedUser_${i}`));
  }
  return testUsers;
};

const populateQueuedGameWithPlayers = (collection, numberOfPlayers, playersCollection) => {
  const players = playersCollection || generateTestUsers(numberOfPlayers);
  return players.forEach((player) => GameController.handlePlayerJoin(collection, player));
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
      sendPlayRequest(null, null, (req, res, body) => {
        const game = JSON.parse(body);
        expect(game.players[0].id).toEqual('defaultTestDeviceId');
        done();
      });
    });
  });
});

describe('Models, Collections and Controllers: ', () => {
  const testUser1 = new User('user1ID');
  const testUser2 = new User('user2ID');
  const testUser3 = new User('user3ID');
  const testUser4 = new User('user4ID');
  const testUser5 = new User('user5ID');
  const testUser6 = new User('user6ID');
  let db = new Games();

  beforeEach(() => {
    db = new Games();
  });

  describe('User Model', () => {
    it('will correctly instantiate a new user', () => {
      expect(new User('someDeviceId').id).toBe('someDeviceId');
      expect(typeof testUser1.username).toBe('string');
    });
  });

  describe('Game Model', () => {
    it('will correctly instantiate a new game', () => {
      db.createGame(testUser1);
      expect(db.getNextOpenGame().players[0].id).toBe('user1ID');
    });

    it('will place a player in a game', () => {
      db.createGame(testUser1);
      GameController.handlePlayerJoin(db, testUser2);
      expect(db.getNextOpenGame().players[0].id).toBe('user1ID');
      expect(db.getNextOpenGame().players[1].id).toBe('user2ID');
    });
    it('will remove a player from a game', () => {
      const testGame = db.createGame(testUser1);
      GameController.handlePlayerJoin(db, testUser2);
      expect(testGame.players.length).toEqual(2);

      GameController.handlePlayerLeave(db, 'game_1', testUser1);
      expect(testGame.players.length).toBe(1);
    });
    it('will adjust the number of seats available after adding players', () => {
      const testGame = db.createGame(testUser1);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 1);

      GameController.handlePlayerJoin(db, testUser2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - testGame.players.length);
    });
    it('will adjust the number of seats available after removing players', () => {
      const testGame = db.createGame(testUser1);
      GameController.handlePlayerJoin(db, testUser2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 2);

      GameController.handlePlayerLeave(db, 'game_1', testUser2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 1);
    });
    it('will start a game after enough players have joined', () => {
      db.createGame(testUser1);
      populateQueuedGameWithPlayers(db, settings.minPlayers - 2);
      expect(db.getNextOpenGame().active).toBe(false);

      GameController.handlePlayerJoin(db, testUser2);
      expect(db.getNextOpenGame().active).toBe(true);
    });
    it('will assign the first dealer', () => {
      db.createGame(testUser1);
      populateQueuedGameWithPlayers(db, settings.minPlayers);
      expect(db.openGames[0].dealer).not.toBe(null);
    });
    it('will assign a random solution from a random category', () => {
      db.createGame(testUser1);
      populateQueuedGameWithPlayers(db, settings.minPlayers - 1);
      expect(db.openGames[0].solutionForDisplay).not.toBe(null);
      expect(db.openGames[0].solutionForMatching).not.toBe(null);
    });
    it('will check guesses', () => {
      const testMessage = {
        type: 'SOCKET_GUESS_MESSAGE',
        userid: 'user1ID',
        message: 'NOT A CORRECT GUESS',
      };
      db.createGame(testUser1);
      populateQueuedGameWithPlayers(db, settings.minPlayers - 1);
      expect(GameController.handleGuess(db, 'game_1', testMessage)).toBe(false);

      testMessage.message = db.getNextOpenGame().solutionForDisplay.toLowerCase();
      expect(GameController.handleGuess(db, 'game_1', testMessage)).toBe(true);
    });
  });

  describe('Game Collection', () => {
    it('will retrieve a game by game id', () => {
      db.createGame(testUser1);
      expect(db.retrieve('game_1').players[0].id).toBe('user1ID');
    });
    it('will quarantine full games', () => {
      db.createGame(testUser1);
      populateQueuedGameWithPlayers(db, settings.maxPlayers - 2);
      expect(db.fullGames.length).toEqual(0);

      GameController.handlePlayerJoin(db, testUser6);
      expect(db.fullGames.length).toEqual(1);
    });
    it('will aggregate games with seats available', () => {
      db.createGame(testUser1);
      db.createGame(testUser2);
      expect(db.openGames.length).toEqual(2);
    });
    it('will move games from openGames to fullGames when they are full', () => {
      db.createGame(testUser1);
      populateQueuedGameWithPlayers(db, settings.maxPlayers - 2);
      expect(db.fullGames.length).toEqual(0);
      GameController.handlePlayerJoin(db, testUser6);
      expect(db.fullGames.length).toEqual(1);
      expect(db.openGames.length).toEqual(0);
    });
    it('will move games from fullGames to openGames when a seat becomes available', () => {
      db.createGame(testUser1);
      expect(db.fullGames.length).toEqual(0);
      populateQueuedGameWithPlayers(db, settings.maxPlayers - 1);
      expect(db.fullGames.length).toEqual(1);
    });
    it('will order open games by number of seats available', () => {
      db.createGame(testUser1);
      db.createGame(testUser2);
      GameController.handlePlayerJoin(db, testUser3);
      GameController.handlePlayerJoin(db, testUser3);
      GameController.handlePlayerJoin(db, testUser3);
      db.createGame(testUser5);

      expect(db.openGames[0][1]).toEqual(3);
      expect(db.openGames[1][1]).toEqual(4);
      expect(db.openGames[2][1]).toEqual(5);
    });
    it('will place users in the game with the most seats available', () => {
      db.createGame(testUser1);
      db.createGame(testUser2);
      GameController.handlePlayerJoin(db, testUser3);
      GameController.handlePlayerJoin(db, testUser4);
      expect(db.openGames[0][1]).toEqual(db.openGames[1][1]);
    });
    it('will create a new game if no seats are available', () => {
      GameController.play(db, 'defaultTestDeviceId', (game) => (
        expect(game.players[0].id).toEqual('defaultTestDeviceId')
      ));
    });
    it('will destroy the game if all players leave', () => {
      db.createGame(testUser1);
      expect(db.openGames.length).toEqual(1);

      GameController.handlePlayerLeave(db, 'game_1', testUser1);
      expect(db.openGames.length).toEqual(0);
    });
  });
});
