const gameController = require('../controllers/GameController');

module.exports = (app, db) => {
  app.get('/api/game/:userId', (req, res) => {
    gameController.play(db, req.params.userId, (game) => res.json(game));
  });
};
