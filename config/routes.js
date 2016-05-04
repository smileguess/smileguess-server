const express = require('express');
const gameController = require('../controllers/GameController');
const app = express();

app.post('/api/randomgame:userid', gameController.joinOrStartGame());
