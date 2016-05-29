'use strict';

const uuid = require('node-uuid');
const debug = require('debug')('npc:npcModel');

module.exports = function Npc(name, race, classes){
  debug('New NPC made')
  this.id = uuid.v1();
  this.name = name;
  this.race = race;
  this.classes = classes;
};
