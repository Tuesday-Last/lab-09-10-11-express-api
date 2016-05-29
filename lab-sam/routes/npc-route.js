'use strict';
const Router = require('express').Router;
const debug = require('debug')('npc:npcRoute');

const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Npc = require('../model/npc');

const npcRoute = module.exports = new Router;

function NewNpc(reqBody){
  debug('NewNpc');
  return new Promise(function(resolve, reject){
    var npc;
    try {
      if(!reqBody.name || !reqBody.race || !reqBody.classes){
        throw AppError.error400('cannot write NPC without defining every property');
      }
      npc = new Npc(reqBody.name, reqBody.race, reqBody.classes);
      storage.setNpc('npc', npc).then(function(npc){
        resolve(npc);
      }).catch(function(err){
        reject(err)
      });
    } catch (err) {
      return reject(err);
    }
  });
};

npcRoute.post('/', function(req, res){
  debug('npc route, post HIT');
  NewNpc(req.body).then(function(npc){
    debug('npc route, post HIT, NewNPC, header sent');
    res.status(200).json(npc);
  }).catch(function(err){
    debug('npc route, post HIT, err caught, header sent');
    res.sendError(err);
  });
});

npcRoute.get('/:id', function(req, res){
  debug('npc route, get HIT');
  storage.fetchNpc('npc', req.params.id).then(function(npc){
    res.status(200).json(npc);
  }).catch(function(err){
    res.sendError(err);
  });
});

npcRoute.put('/:id', function(req, res){
  debug('npc route, Put');
  storage.updateNpc('npc', req.params.id, req.body).then(function(npc){
    res.status(200).json(npc);
  }).catch(function(err){
    res.sendError(err);
  });
});

npcRoute.delete('/:id', function(req, res){
  debug('npc route, Delete HIT');
  storage.deleteNpc('npc', req.params.id)
  .then(function(){
    res.status(200);
  }).catch(function(err){
    res.sendError(err);
  });
});
