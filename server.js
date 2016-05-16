const express = require('express');
const Games = require('./collections/Games');
const Users = require('./collections/Users');
const ioCreate = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const io = ioCreate.listen(server);

const db = {
  games: new Games(io),
  users: new Users(),
};

require('./config/routes.js')(app, db);

const port = process.env.PORT || 1234;

require('./config/sockets.js')(io, db);

if (!module.parent) {
  server.listen(port);
  console.log(`server started on port ${port}`);
}

module.exports = {
  io, db,
};
