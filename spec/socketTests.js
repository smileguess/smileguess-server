// const GameController = require('../controllers/GameController');
// const User = require('../models/User');
// const settings = require('../config/gameSettings');
const testUtils = require('./testUtils');

// const express = require('express');
const serverURL = 'http://127.0.0.1:1234';
// const ioCreate = require('socket.io');
const io = require('socket.io-client');
const joinGame = require('../sockets/joinGame');
// const testApp = express();
const server = require('../server.js');

const Users = require('../collections/Users');
const UserController = require('../controllers/UserController');
const Games = require('../collections/Games');

const users = server.db.users;
const games = server.db.games;

// Instantiate a user for testing
testUtils.sendUserRequest(null, (err, res, body) => {
  let testUser = JSON.parse(body);
  console.log('testUser', testUser);
  testUtils.sendPlayRequest(null, (err, res, body) => {
    let testGame = JSON.parse(body);
    console.log('testGame', testGame);
    console.log('open games', games.openGames);
    console.log(users);
    console.log(games);
  });
});
// Instantiate a game for testing

let socket;

// describe('Socket responder functions', () => {
//   beforeEach(() => {
//     socket = io.connect(serverURL, {
//       'reconnection delay': 0,
//       'reopen delay': 0,
//       'force new connection': true,
//     });
//   });
//   describe('join game socket room', () => {
//     const label = 'joinGame';
//     it('should be a function', () => {
//       expect(typeof joinGame).toBe('function');
//     });
//     it('should impart users with socket objects', (done) => {
//       socket.emit('action', {
//         type: `server/${label}`,
//         userId: 1,
//         gameId: 1,
//       });
//       setTimeout(() => {
//         console.log(UserController.get(users, 1));
//         expect(UserController.get(users, 1).socket).not.toBe(null);
//         done();
//       }, 500);
//     });
//   });
// });

describe('Game notifications', () => {
  beforeEach(() => {
    socket = io.connect(serverURL, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
    });
  });
  const label = 'sendMemo';
  it('should be a function', () => {
    expect(typeof joinGame).toBe('function');
  });
  it('should impart users with socket objects', (done) => {
    socket.emit('action', {
      type: `server/${label}`,
      userId: 1,
      gameId: 1,
    });
    setTimeout(() => {
      console.log(UserController.get(users, 1));
      expect(UserController.get(users, 1).socket).not.toBe(null);
      done();
    }, 500);
  });
});



// let testUser = {};
// let testGame = {};




// Wills before each fucntion body
/*
    // socket = io.connect(serverURL, {
    //   'reconnection delay': 0,
    //   'reopen delay': 0,
    //   'force new connection': true,
    // });
    // socket.on('connect', () => {
    //   socket.emit('action', {
    //     type: 'server/joinGame',
    //     gameId: 1,
    //     userId: 1,
    //   });
      // done();

  // afterEach((done) => {
  //   socket.disconnect();
  //   done();
  */

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


