'use strict';

const express = require('express');
const debug = require('debug')('npc:server');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const errorResponse = require('./lib/error-response');
const AppError = require('./lib/app-error');

const npcRouter = require(__dirname + '/routes/npc-route');
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(errorResponse);
app.use(morgan('dev'))

app.use('/api/npc', npcRouter);

app.all('*', function(req, res){
  debug('* 404');
  const err = new AppError.error404('route not found')
  res.sendError(err);
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app running on port', port);
});

server.isRunning = true;
module.exports = server;
