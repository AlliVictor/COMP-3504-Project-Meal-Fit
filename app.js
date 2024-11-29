'use strict';

const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set('Content-Type', 'application/json');
  next();
});

const startServer = async _ => {

  const database = require("./src/database");
  let db = await database.setup();

  const routes = require('./src/routes');
  routes.register(app, db);

  const searchroutes = require('./src/searchroutes');
  searchroutes.register(app, db);

  const userroutes = require('./src/userroutes');
  userroutes.register(app, db);


  const PORT = process.env.PORT || 8080;
  const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
  process.on('unhandledRejection', err => {
    console.error(err);
    throw err;
  });

  return server;
}

startServer()