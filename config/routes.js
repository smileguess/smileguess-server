const GameController = require('../controllers/GameController');
const UserController = require('../controllers/UserController');

module.exports = (app, db) => {
  app.get('/api/game/', (req, res) => {
    GameController.play(db.games, (game) => {
      res.json(game.summary());
    });
  });

  app.get('/api/user/:deviceId', (req, res) => {
    UserController.create(req, res, db.users, (user) => {
      res.json(user.summary());
    });
  });
};
