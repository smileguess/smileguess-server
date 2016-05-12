const dummy = require('./dummySocketData.js');

/**
 * Function for setting up a users socket connection
 * @param {Object} io - the socket.io object
 * @param {Object} socket - the users socket connection
 */
const onConnect = (io, socket) => {
  console.log('Connected to Socket');
};
module.exports = onConnect;
/**
 * TODO: Expect that the client will make a REST call 
 * to server to get the game data upon entering a game
 */


