const reporter = require('./support/reporter');
const request = require('request');
const User = require('../models/User');
const Games = require('../collections/Games.js');
const gameMethods = require('../controllers/GameController');
const settings = require('../gameSettings');
jasmine.getEnv().addReporter(reporter);

const serverURL = 'http://127.0.0.1:1234';
const joinOrStartGameURL = 'http://127.0.0.1:1234/api/play/';



const sendNewOrRandomGameRequest = (deviceId, requestOptions, callback) => {
  const id = deviceId || 'defaultTestDeviceId';
  const options = requestOptions || {
    method: 'GET',
    uri: joinOrStartGameURL + id,
  };
  return request(options, (err, res, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
    }
    callback(err, res, body);
  });
};

describe('Basic Server Functions', () => {
  describe('Server', () => {
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
  });
});

describe('Models, Controllers and Collections: ', () => {
  const testUser1 = new User('user1ID');
  const testUser2 = new User('user2ID');
  const testUser3 = new User('user3ID');
  const testUser4 = new User('user4ID');
  const testUser5 = new User('user5ID');
  const testUser6 = new User('user6ID');
  const testUsers = [testUser1, testUser2, testUser3, testUser4, testUser5, testUser6]
  let db = new Games();

  beforeEach(() => {
    db = new Games();
  });

  generateTestUsers = (n) => {
    const testUsers = [];
    for (let i = 1; i <= n; i++) {
      testUsers.push(new User('user' + i));
    }
    return testUsers;
  }

  describe('User Model', () => {
    it('will correctly instantiate a new user', () => {
      const someNewUser = new User('someDeviceId');
      expect(someNewUser.id).toBe('someDeviceId');
      // test that a username was generated
      expect(typeof testUser1.username).toBe('string');
    });
  });

  describe('Game: Model, Collection and Controllers', () => {
    it('will correctly instantiate a new game', () => {
      db.createGame(testUser1);
      expect(db.openGames[0].players[0].id).toBe('user1ID');
    });

    it('will place a user in a game', () => {
      db.createGame(testUser1);
      gameMethods.handlePlayerJoin(db, testUser2);
      expect(db.lastInQueue().players[0].id).toBe('user1ID');
      expect(db.lastInQueue().players[1].id).toBe('user2ID');
    });
    it('will retrieve a game by game id', () => {
      db.createGame(testUser1);
      const retrieved = db.retrieve('game1');
      expect(retrieved.players[0].id).toBe('user1ID');
    })
    it('will remove a player from a game', () => {
      const testGame = db.createGame(testUser1);
      gameMethods.handlePlayerJoin(db, testUser2);
      expect(testGame.players.length).toEqual(2);

      gameMethods.handlePlayerLeave(db, 'game1', testUser1);
      expect(testGame.players.length).toBe(1);
    })
    it('will adjust the number of seats available after adding players', () => {
      const testGame = db.createGame(testUser1);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 1);

      gameMethods.handlePlayerJoin(db, testUser2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - testGame.players.length);
    });
    it('will adjust the number of seats available after removing players', () => {
      const testGame = db.createGame(testUser1);
      gameMethods.handlePlayerJoin(db, testUser2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 2);

      gameMethods.handlePlayerLeave(db, 'game1', testUser2);
      expect(testGame.seatsOpen).toEqual(settings.maxPlayers - 1);
    });
    it('will quarantine full games', () => {
      const testGame = db.createGame(testUser1);
      const testUsers = generateTestUsers(settings.maxPlayers - 2);
      testUsers.forEach((player) => gameMethods.handlePlayerJoin(db, player));
      expect(db.fullGames.length).toEqual(0);

      gameMethods.handlePlayerJoin(db, testUser6);
      expect(db.fullGames.length).toEqual(1);
    });
    it('will aggregate games with seats available', () => {
      db.createGame(testUser1);
      db.createGame(testUser2);
      expect(db.openGames.length).toEqual(2);
    });
    it('will remove games from openGames when they are no longer open and add games to fullGames', () => {
      const testGame = db.createGame(testUser1);
      const testUsers = generateTestUsers(settings.maxPlayers - 2);
      testUsers.forEach((player) => gameMethods.handlePlayerJoin(db, player));
      expect(db.fullGames.length).toEqual(0);

      gameMethods.handlePlayerJoin(db, testUser6);
      expect(db.fullGames.length).toEqual(1);
      expect(db.openGames.length).toEqual(0);
    });
    it('will remove games from fullGames when a seat becomes available, then add them to openGames', () => {
      const testGame = db.createGame(testUser1);
      const testUsers = generateTestUsers(settings.maxPlayers - 1);
      testUsers.forEach((player) => gameMethods.handlePlayerJoin(db, player));
      expect(db.fullGames.length).toEqual(1);
    });
    it('will order open games by number of seats available', () => {
      const testGame1 = db.createGame(testUser1);
      const testGame2 = db.createGame(testUser2);
      gameMethods.handlePlayerJoin(db, testUser3);
      expect(db.openGames[0].seatsOpen).toEqual(4);
      expect(db.openGames[1].seatsOpen).toEqual(5);
    });
    it('will place users in the game with the most seats available', () => {
      const testGame1 = db.createGame(testUser1);
      const testGame2 = db.createGame(testUser2);
      gameMethods.handlePlayerJoin(db, testUser3);
      gameMethods.handlePlayerJoin(db, testUser4);
      expect(db.openGames[0].players.length).toEqual(db.openGames[1].players.length);
    });
    it('will create a new game if no seats are available', () => {
      
    });
    xit('will start a game after enough players have joined', () => {
      expect(openGames[openGames.length - 1].active).toBe(false);
      for (let i = 1; i < settings.minPlayers; i++) {
      }
      expect(openGames[openGames.length - 1].active).toBe(true);
    });
    xit('will assign the first dealer', () => {
      expect(openGames[openGames.length - 1].dealer).not.toBe(null);
    });
    xit('will assign a random solution from a random category', () => {
      expect(openGames[openGames.length - 1].solutionForDisplay).not.toBe(null);
      expect(openGames[openGames.length - 1].solutionForMatching).not.toBe(null);
    });
    xit('will destroy the game if all players leave', () => {
      openGames[0].removePlayer(testUser4);
      openGames[0].removePlayer(testUser4);
      expect(openGames.length).toBe(1);
      openGames[0].removePlayer(testUser6);
      expect(openGames.length).toBe(0);
    });
    xit('will check guesses', () => {
      // game method built, but waiting until message functions are built to test
    });
  });
});
