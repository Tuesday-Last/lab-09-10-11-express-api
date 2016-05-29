'use strict';

const del = require('del');
const debug = require('debug')('npc:storage');
const AppError = require('./app-error');
exports.pool = {};

exports.setNpc = function(schema, item){
  debug('setItem');
  return new Promise((resolve, reject) => {
    if (!item.id) {
      var err = AppError.error400('storage setItem requires id');
      return reject(err);
    }
    if (!this.pool[schema]) this.pool[schema] = {};
    this.pool[schema][item.id] = item;
    resolve(item);
  });
};

exports.updateNpc = function(schema, id, item){
  debug('updateItem');
  console.log('UPDATE item', item);
  console.log('item.name', item.name);
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      var err = AppError.error404('storage item not found');
      return reject(err);
    }
    if (!!item.name == false && !!item.race == false && !!item.classes == false){
      console.log('Update NPC incomplete input');
      var err = AppError.error400('no Item to update');
      return reject(err);
    }
    console.log('PUT no Error');
    if (item.name){
      console.log('item.name', item.name);
      this.pool[schema][id].name = item.name;
    } if (item.race){
      console.log('item.race', item.race);
      this.pool[schema][id].race = item.race;
    }
    if (item.race){
      this.pool[schema][id].classes = item.classes;
    }
    resolve(this.pool[schema][id]);
  });
};

exports.fetchNpc = function(schema, id){
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      var err = AppError.error404('storage item not found');
      return reject(err);
    }
    resolve(this.pool[schema][id]);
  });
};

exports.deleteNpc = function(schema, id){
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      var err = AppError.error404('storage item not found');
      return reject(err);
    }
    del([this.pool[schema][id]]);
    resolve(true);
  });
};
