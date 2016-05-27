'use strict';

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
    delete this.pool[schema][id];
    resolve(true);
  });
};
