const reporter = require('./support/reporter');
jasmine.getEnv().addReporter(reporter);

const request = require('request');
const testUtils = require('./testUtils');
const serverURL = 'http://127.0.0.1:1234';

describe('Server Functions', () => {
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
      expect(user.hasOwnProperty('id')).toBe(true);
      done();
    });
  });
});
