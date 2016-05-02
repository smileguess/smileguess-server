const request = require('request');
const reporter = require('./spec/support/reporter.js');

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
