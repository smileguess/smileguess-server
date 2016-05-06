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

const sendNewOrRandomGameRequest = (deviceId, requestOptions) => {
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
  let openGames = Games.openGames;
  const fullGames = Games.fullGames;
  const testUser1 = new User('user1ID');
  const testUser2 = new User('user2ID');
  const testUser3 = new User('user3ID');
  const testUser4 = new User('user4ID');
  const testUser5 = new User('user5ID');
  const testUser6 = new User('user6ID');
  const testGame1 = new Game(testUser1);

  describe('User Model', () => {
    it('will correctly instantiate a new user', () => {
      expect(testUser1.id).toBe('user1ID');
      expect(typeof testUser1.username).toBe('string');
    });
  });

  describe('Game: Model, Collection and Controllers', () => {
    it('will correctly instantiate a new game', () => { 
      expect(testGame1.players[0].id).toBe('user1ID');
    });

    it('will place a user in a game', () => {
      const testUser2 = new User('user2ID');
      testGame1.addPlayer(testUser2);
      expect(testGame1.players[0].id).toBe('user1ID');
      expect(testGame1.players[1].id).toBe('user2ID');
    });
    it('will remove a player from a game', () => {
      testGame1.removePlayer(testUser1);
      expect(testGame1.players.length).toBe(1);
    })
    it('will adjust the number of seats available after adding players', () => {
      testGame1.addPlayer(testUser2);
      testGame1.addPlayer(testUser3);
      expect(testGame1.seatsOpen).toBe(settings.maxPlayers - 3);
    });
    it('will adjust the number of seats available after removing players', () => {
      testGame1.removePlayer(testUser2);
      testGame1.removePlayer(testUser3);
      expect(testGame1.seatsOpen).toBe(settings.maxPlayers - 1);
    });
    it('will quarantine full games', () => {
      testGame1.addPlayer(testUser2);
      testGame1.addPlayer(testUser3);
      testGame1.addPlayer(testUser4);
      testGame1.addPlayer(testUser5);
      testGame1.addPlayer(testUser6);
      expect(Games.fullGames.length).toBe(1);
    });
    it('will aggregate games with seats available', () => {
      testGame1.removePlayer(testUser6);
      expect(openGames.length).toBe(1);
    });
    it('will remove games from openGames when they are no longer open and add games to fullGames', () => {
      expect(fullGames.length).toBe(0);
      expect(openGames.length).toBe(1);

      testGame1.addPlayer(testUser6);

      expect(fullGames.length).toBe(1);
      expect(openGames.length).toBe(0);
    });
    it('will remove games from fullGames when a seat is open, and add games to openGames', () => {
      testGame1.removePlayer(testUser6);
      expect(fullGames.length).toBe(0);
      expect(openGames.length).toBe(1);
    });
    it('will order open games by number of seats available', () => {
      const testGame2 = new Game(testUser2);
      testGame2.updateGameAvailability();
      Games.sort(openGames);
      expect(openGames[0].seatsOpen < openGames[1].seatsOpen).toBe(true);
    });
    it('will place users in the game with the most seats available', (done) => {
      console.log(openGames);
      sendNewOrRandomGameRequest('someUsersPhoneId')
        .on('response', () => (expect(openGames[1].seatsOpen).toBe('purple')));
        done();
    });
    it('will create a new game if no seats are available', (done) => {
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
    it('will start a game after enough players have joined', () => {
      expect(openGames[openGames.length - 1].active).toBe(false);
      for (let i = 1; i < settings.minPlayers; i++) {
      }
      expect(openGames[openGames.length - 1].active).toBe(true);
    });
    it('will assign the first dealer', () => {
      expect(openGames[openGames.length - 1].dealer).not.toBe(null);
    });
    it('will assign a random solution from a random category', () => {
      console.log(openGames[openGames.length - 1].solutionForDisplay);
      expect(openGames[openGames.length - 1].solutionForDisplay).not.toBe(null);
      expect(openGames[openGames.length - 1].solutionForMatching).not.toBe(null);
    });
    it('will destroy the game if all players leave', () => {
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
