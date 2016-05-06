const GameController = require('../controllers/GameController');

module.exports = (app) => {
  app.get('/api/play/:userId', GameController.joinOrStartGame);
};
