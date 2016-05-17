const GameController = require('../controllers/GameController');
const UserController = require('../controllers/UserController');

module.exports = (app, db) => {
  app.get('/api/game/', (req, res) => {
    GameController.play(db.games, (game) => {
      const myObj = {
        id: game.id,
        players: {
          all: game.players.all,
          byId: game.players.byId,
        },
        dealerId: game.dealerId,
        prompt: {
          category: game.prompt.category,
          forDisplay: game.prompt.forDisplay,
        },
        active: game.active,
      };
      res.json(myObj);
    });
  });

  app.get('/api/user/:deviceId', (req, res) => {
    UserController.create(req, res, db.users, (user) => {
      res.json({
        id: user.userId,
        username: user.username,
        points: user.points,
        wins: user.wins,
        emojicoins: user.emojicoins,
        picture: user.picture,
      });
    });
  });
};
