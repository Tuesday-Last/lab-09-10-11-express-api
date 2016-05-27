'use strict';

const express = require('express');
const debug = require('debug')('npc:server');
const bodyParser = require('body-parser');

const npcRouter = require(__dirname + '/routes/npc-route');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/api/npc', npcRouter);

app.all('*', function(req, res){
  debug('* 404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app running on port', port);
});

server.isRunning = true;
module.exports = server;
