'use strict';

const debug = require('debug')('hero:storage');
const AppError = require('./app-error');
exports.pool = {};


exports.setItem = function(schema, item){
  debug('setItem');
  return new Promise((resolve, reject) => {
    if(!item.name) {
      var errSetItem = AppError.error400('storage setItem requires name');
      return reject(errSetItem);
    }
    if(!this.pool[schema]){
      this.pool[schema] = {};
    }
    if(!this.pool[schema][item.id]) {
      this.pool[schema][item.id] = item;
      resolve(item);
    }
  });
};

exports.fetchItem = function(schema, id){
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    if(!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if(!this.pool[schema][id]){
      var errFetchItem = AppError.error404('storage item not found');
      return reject(errFetchItem);
    }
    resolve(this.pool[schema][id]);
  });
};

exports.deleteItem = function(schema, id){
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    if(!this.pool[schema]){
      var err = AppError.error404('storage schema hero found');
      return reject(err);
    }
    if(!this.pool[schema][id]){
      var errDeleteItem = AppError.error404('storage item not found');
      return reject(errDeleteItem);
    }
    delete this.pool[schema][id];
    resolve(true);
  });
};
