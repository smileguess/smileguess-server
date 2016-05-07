const express = require('express');
const Games = require('./collections/Games');
const db = new Games();

const app = express();
const server = require('http').createServer(app);
require('./config/routes.js')(app, db);

const port = process.env.PORT || 1234;

require('./config/middleware.js')(app);
require('./config/sockets.js')(server, db);

if (!module.parent) {
  server.listen(port);
  console.log(`server started on port ${port}`);
}
