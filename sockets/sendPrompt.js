const sendPrompt = (io, socket, action, db) => {
  io.to(dummy.gameId).emit('action', {
    type: 'SOCKET_GUESS_MESSAGE',
    userid: action.username,
    message: action.message,
  });
};

module.exports = sendPrompt;
