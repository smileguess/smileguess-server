const express = require('express');
const database = require('./collections/Games');

const app = express();
const server = require('http').createServer(app);
require('./config/routes.js')(app, express);

const port = process.env.PORT || 1234;

require('./config/middleware.js')(app);
require('./config/sockets.js')(server);

if (!module.parent) {
  server.listen(port);
  console.log(`server started on port ${port}`);
}

module.exports = app;

