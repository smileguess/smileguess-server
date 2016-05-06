const reporter = require('./support/reporter');
const request = require('request');
const User = require('../models/User');
const Game = require('../models/Game');
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
  beforeEach(() => {
    console.log('before each called!!!!!!!!!!!!!!!!')
    db.flushOpenGames();
    db.flushFullGames();
  });
  const testUser1 = new User('user1ID');
  const testUser2 = new User('user2ID');
  const testUser3 = new User('user3ID');
  const testUser4 = new User('user4ID');
  const testUser5 = new User('user5ID');
  const testUser6 = new User('user6ID');
  const db = new Games();

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
      db.lastInQueue().addPlayer(testUser2);
      expect(db.lastInQueue().players[0].id).toBe('user1ID');
      expect(db.lastInQueue().players[1].id).toBe('user2ID');
    });
    it('will remove a player from a game', () => {
      db.createGame(testUser1)
      db.lastInQueue().addPlayer(testUser2);
      db.lastInQueue().removePlayer(testUser1);
      expect(db.lastInQueue().players.length).toBe(1);
    })
    it('will adjust the number of seats available after adding players', () => {
      const testGame4 = new Game(testUser4);
      testGame4.addPlayer(testUser2);
      testGame4.addPlayer(testUser3);
      expect('check this test').toBe(settings.maxPlayers - 3);
    });
    it('will adjust the number of seats available after removing players', () => {
      const testGame5 = new Game(testUser5);
      testGame5.addPlayer(testUser6);
      testGame5.removePlayer(testUser5);
      expect('check this test').toBe(settings.maxPlayers - 1);
    });
    it('will quarantine full games', () => {
      const testGame6 = new Game(testUser6);
      for (let i = 1; i < settings.maxPlayers; i++) {
        testGame6.addPlayer(testUser1);
      }
      console.log(Games.fullGames);
      expect(fullGames.length).toEqual(1);
    });


    it('will aggregate games with seats available', () => {
      console.log(Games.openGames.storage.length);
      const testGame7 = new Game(testUser1);
      testGame7.addPlayer(testUser2);
      console.log(Games.openGames.storage.length);
      expect(Games.openGames.storage.length).toBe(5);
    });


    it('will remove games from openGames when they are no longer open and add games to fullGames', () => {
      expect(fullGames.length).toBe(1);
      expect(openGames.length).toBe(5);
      console.log(openGames);
      // testGame8 = new Game(testUser1);
      // testGame8.addPlayer(testUser6);

      expect(fullGames.length).toBe(1);
      // expect(openGames.length).toBe(0);
    });
    xit('will remove games from fullGames when a seat is open, and add games to openGames', () => {
      testGame1.removePlayer(testUser6);
      expect(fullGames.length).toBe(0);
      expect(openGames.length).toBe(1);
    });
    xit('will order open games by number of seats available', () => {
      const testGame2 = new Game(testUser2);
      testGame2.updateGameAvailability();
      Games.sort(openGames);
      expect(openGames[0].seatsOpen < openGames[1].seatsOpen).toBe(true);
    });
    xit('will place users in the game with the most seats available', (done) => {
      sendNewOrRandomGameRequest('someUsersPhoneId')
        .on('response', () => (expect(openGames[1].seatsOpen).toBe('purple')));
        done();
    });
    xit('will create a new game if no seats are available', (done) => {
      //fill up the openGames array
      openGames.forEach((game) => {
        for (let i = game.length - 1; i < settings.maxPlayers - 1; i++) {
          const testDeviceId = 'deviceId' + i;
          sendNewOrRandomGameRequest(testDeviceId);
        }
      }).then(() => {
        expect(openGames.length).toBe(0);
        sendNewOrRandomGameRequest('someDeviceId');
      }).then(() => {
        expect(openGames.length).toBe(1);
      });
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
