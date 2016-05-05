const express = require('express');
const gameController = require('../controllers/GameController');
const app = express();

app.post('/api/:userId', gameController.joinOrStartGame);
