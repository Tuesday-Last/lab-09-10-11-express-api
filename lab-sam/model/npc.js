'use strict';

const uuid = require('node-uuid');

module.exports = function Npc(name, race, classes){
  this.id = uuid.v1();
  this.name = name;
  this.race = race;
  this.classes = classes;
};
