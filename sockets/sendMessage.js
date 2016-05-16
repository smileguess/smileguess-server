const messageController = require('../controllers/messageController');

/**
 * This function sends a clue message to all the members of a room through sockets.
 * When this action is received on the client, it will be dispatched by redux automatically.
 * @param {Object} io - this is the socket.io object
 * @param {Object} socket - the users socket connection
 * @param {Object} action - the action passed to the server from the client
 * @example <caption>The action emitted:</caption>
 *
 * Example action received from the client:
 * let action = {
 *   type: ,
 *   userId: 6,
 *   body: 'home on the range',
 * }
 *
 * Example response sent to all clients in the game:
 * let action = {
    type: 'UPDATE_MESSAGE_STATE',
    payload: {
      id: 289,
      time: action.time,
      userId: action.userId,
      type: messageType,
      message: action.message,
    }, * };
 */

const sendMessage = (io, socket, action) => {
  console.log('sending clue message. action:', action);
  io.to(action.gameId).emit('action', messageController.create(action));
};

module.exports = sendMessage;
