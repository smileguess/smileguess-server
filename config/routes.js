const GameController = require('../controllers/GameController');
const UserController = require('../controllers/UserController');

module.exports = (app, db) => {
  app.get('/api/game/', (req, res) => {
    console.log('game requested via http:')
    GameController.play(db.games, (game) => {
      console.log('responding with game:', game.summary());
      res.json(game.summary());
    });
  });

  app.get('/api/user/:deviceId', (req, res) => {
    console.log('user requested via http');
    UserController.create(req, res, db.users, (user) => {
      res.json(user.summary());
    });
  });
};
