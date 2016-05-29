'use strict';

const uuid = require('node-uuid');
const debug = require('debug')('hero:hero');
const AppError = require('../lib/app-error');
const superPowerPool = ['Acid generation', 'Animal mimicry', 'Firebreathing', 'Poison generation', 'Sonic scream', 'Superhuman strength', 'Night vision', 'Waterbreathing', 'Telepathy', 'Psychic weapons', 'Immortality', 'Animal control', 'Superhuman speed', 'Teleportation'];

module.exports = function(name){
  debug('creating hero');
  if(name == '' || null) throw AppError.error400('hero constructor requires content');
  this.id = uuid.v1();
  this.name = name;
  this.superPower = superPowerPool[Math.floor(Math.random() * 14)];
  this.timestamp = new Date();
};
