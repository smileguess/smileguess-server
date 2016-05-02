const reporter = require('./spec/support/reporter.js');
const request = require('request');
const User = require('../models/users.js');
const Game = require('../models/games.js');

jasmine.getEnv().addReporter(reporter);

const serverURL = 'http://127.0.0.1:1234';

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

describe('Models', () => {
  const testUser = new User('56Xfd8');
  describe('User Model', () => {
    it('will correctly instantiate a new user', () => {
      expect(testUser.id).toBe('56Xfd8');
      expect(typeof testUser.username).toBe('string');
    });
  });

  describe('Game Model', () => {
    it('will correctly instantiate a new game', () => {
      const testGame = new Game(testUser);
      expect(testGame.players[0].id).toBe('56Xfd8');
    });
  });
});
