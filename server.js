const express = require('express');

const app = express();
const port = process.env.PORT || 1234;

if (!module.parent) {
  app.listen(port);
  console.log('server started on port: ', port);
}

module.exports = app;
