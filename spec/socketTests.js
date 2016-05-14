const reporter = require('./support/reporter');
const io = require('socket.io-client');
const serverURL = 'http://127.0.0.1:1234';
const testUtils = require('./testUtils');
const joinGame = require('../sockets/joinGame');
const User = require('../models/User');
const Users = require('../collections/Users');
const Games = require('../collections/Games');
const settings = require('../config/gameSettings');
const testUser1 = new User('testUser1ID');
const GameController = require('../controllers/GameController');
const request = require('request');
let testUser = {};
let testGame = {};

// Instantiate a game for testing
testUtils.sendPlayRequest(null, (body) => {
  testGame = body;
});
// Instantiate a user for testing
testUtils.sendUserRequest(null, (body) => {
  testUser = body;
});

describe('Socket responder functions', () => {
  beforeEach((done) => {
    socket = io.connect(serverURL, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
    });
    socket.on('connect', () => {
      socket.emit('action', {
        type: 'server/joinGame',
        gameId: 1,
        userId: 1,
      });
      done();
    });
  });

  // afterEach((done) => {
  //   socket.disconnect();
  //   done();
  });
  describe('join game socket room', () => {
    expect(UserController.get(db.users, 1).socket).not.toBe(undefined);
    let label = 'joinGame';
    it('should be a function', () => {
      expect(typeof joinGame).toBe('function');
    });
    // it('should impart users with socket objects')
//     xit('should respond with an action called ' + actionType, (done) => {
//       socket.on('action', (response) => {
//         console.log(response);
//         if (response.type === actionType) {
//           expect(response.type).toBe(actionType);
//           expect(response.message).toBe('testGuessMessage');
//           done();
//         }
//       });
      socket.emit('action', {
        type: 'server/' + label,
        userId: 1,
        gameId: 1,
      });
  });
//     });
//   });

//   describe('sendClueMessage', () => {
//     let actionType = 'SOCKET_CLUE_MESSAGE'
//     let label = 'sendClueMessage';
//     xit('should be a function', () => {
//       expect(typeof sendClueMessage).toBe('function');
//     });
//     xit('should respond with an action called ' + actionType, (done) => {
//       socket.on('action', (response) => {
//         console.log('RESPONSE', response);
//         if (response.type === actionType) {
//           expect(response.userid).toBe(1);
//           expect(response.message).toBe('testClueMessage');
//           done();
//         }
//       });
//       socket.emit('action', {
//         type: 'server/' + label,
//         gameId: 1,
//         userId: 1,
//         message: 'testClueMessage',
//       });
//     });
//   });

//   //problem is we are passing a different db to the sockets than this one
//   describe('Socket puts users in games', () => {
//     let actionType = 'SOCKET_JOIN_GAME'
//     let label = 'joinGame';
//     xit('should be a function', () => {
//       expect(typeof sendClueMessage).toBe('function');
//     });
//     xit('should respond with an action called ' + actionType, (done) => {
//       socket.on('action', (response) => {
//         console.log('RESPONSE', response);
//         if (response.type === actionType) {
//           console.log(response);

//         }
//       });
//       socket.emit('action', {
//         type: 'server/' + label,
//         gameId: 1,
//         userId: 1,
//         deviceId: 'someDeviceId',
//       });
//     });
//   });

  // describe('sendPrompt', () => {
  //   let actionType = 'SOCKET_PROMPT'
  //   let label = 'sendPrompt';
  //   it('should be a function', () => {
  //     expect(typeof sendPrompt).toBe('function');
  //   });
  //   it(`send a prompt to only the current dealer ${actionType}`, (done) => {
  //     db.createGame(testUser1);
  //     expect(db.getNextOpenGame().promptForDisplay).toBe(null);
  //     testMethods.populateGameWithPlayers(db, settings.minPlayers - 1);
  //     expect(db.getNextOpenGame().promptForDisplay).not.toBe(null);
  //     const prompt = db.getNextOpenGame().promptForDisplay;
  //     socket.on('action', (response) => {
  //       if (response.type === actionType) {
  //         // expect(response.userid).toBe(5);
  //         // expect(response.message).toBe('testClueMessage');
  //         done();
  //       }
  //     });
  //     socket.emit('action', {
  //       type: 'server/' + label,
  //       dealerIndex: 5,
  //     });
  //     done();
  //   });
  // });

// });


