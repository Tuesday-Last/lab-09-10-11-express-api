'use strict';
const Router = require('express').Router;
const npcRoute = module.exports = new Router;
const AppError = require('../lib/app-error');
const debug = require('debug')('npc:npcRoute');
const storage = require('../lib/storage');
const Npc = require('../model/npc');

function NewNpc(reqBody){
  debug('NewNpc');
  return new Promise(function(resolve, reject){
    var npc;
    try {
      npc = new Npc(reqBody.name, reqBody.race, reqBody.classes);
    } catch (err) {
      reject(err);
    }
    storage.setNpc('npc', npc).then(function(npc){
      resolve(npc);
    }).catch(function(err){
      reject(err)
    });
  });
};

npcRoute.post('/', function(req, res){
  debug('npc route, post');
  NewNpc(req.body).then(function(npc){
    res.status(200).json(npc);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});

npcRoute.get('/:id', function(req, res){
  debug('npc route, get');
  storage.fetchNpc('npc', req.params.id).then(function(npc){
    res.status(200).json(npc);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});

// npcRoute.put('/:id', function(req, res){
//   debug('npc route, get');
//   storage.fetchNpc('npc', req.params.id).then(function(npc){
//     res.status(200).json(npc);
//   }).catch(function(err){
//     console.error(err.message);
//     if(AppError.isAppError(err)){
//       res.status(err.statusCode).send(err.responseMessage);
//       return;
//     }
//     res.status(500).send('interal server error');
//   });
// });
