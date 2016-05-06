const dummy = require('./dummySocketData.js');

/**
 * Function is called when a socket action is received
 * from the client requesting to join a random game.
 * A game is chosen, the user joins the socket room for
 * that game, and the other players are sent a 
 * 'SOCKET_PLAYER_JOIN_GAME' action
 * @param {Object} io - the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} user - The user object of the user joining
 */
const joinRandomGame = (io, socket, user) => {
  socket.join(dummy.gameId);
  socket.broadcast.to(dummy.gameId).emit('action', {
    type: 'SOCKET_PLAYER_JOIN_GAME',
    user: dummy.user,
  });
};

module.exports = joinRandomGame;

