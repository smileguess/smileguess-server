const reporter = require('./support/reporter.js');
jasmine.getEnv().addReporter(reporter);
const io = require('socket.io-client');
const serverURL = 'http://127.0.0.1:1234';

const sendGuessMessage = require('../sockets/sendGuessMessage.js');
const sendClueMessage = require('../sockets/sendClueMessage.js');
const sendWinner = require('../sockets/sendWinner.js');

var socket;
describe('Socket responder functions', () => {
  beforeEach((done) => {
    socket = io.connect(serverURL, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
    });
    socket.on('connect', () => {
      socket.emit('action', {
        type: 'server/joinRandomGame',
        user: { id: 5, username: 'testUser' },
      });
      done();
    });
  });

  afterEach((done) => {
    socket.disconnect();
    done();
  });

  describe('sendGuessMessage', () => {
    let actionType = 'SOCKET_GUESS_MESSAGE'
    let label = 'sendGuessMessage';
    it('should be a function', () => {
      expect(typeof sendGuessMessage).toBe('function');
    });
    it('should respond with an action called ' + actionType, (done) => {
      socket.on('action', (response) => {
        if (response.type === actionType) {
          expect(response.type).toBe(actionType);
          expect(response.userid).toBe(5);
          expect(response.message).toBe('testGuessMessage');
          done();
        }
      });
      socket.emit('action', {
        type: 'server/' + label,
        userid: 5,
        message: 'testGuessMessage'
      });
    });
  });

  describe('sendClueMessage', () => {
    let actionType = 'SOCKET_CLUE_MESSAGE'
    let label = 'sendClueMessage';
    it('should be a function', () => {
      expect(typeof sendClueMessage).toBe('function');
    });
    it('should respond with an action called ' + actionType, (done) => {
      socket.on('action', (response) => {
        if (response.type === actionType) {
          expect(response.userid).toBe(5);
          expect(response.message).toBe('testClueMessage');
          done();
        }
      });
      socket.emit('action', {
        type: 'server/' + label,
        userid: 5,
        message: 'testClueMessage'
      });
    });
  });

});


