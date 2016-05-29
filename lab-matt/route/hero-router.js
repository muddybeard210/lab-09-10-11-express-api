'use strict';

const Router = require('express').Router;
const heroRouter = module.exports = new Router();
const debug = require('debug')('hero:hero-router');
const storage = require('../lib/storage');
const Hero = require('../model/hero');
const bodyParser = require('body-parser').json();
const AppError = require('../lib/app-error');


function createHero(reqBody){
  debug('createHero');
  return new Promise(function(resolve, reject){
    var hero;
    try {
      hero = new Hero(reqBody.name);
      storage.setItem('hero', hero).then(function(hero){
        resolve(hero);
      }).catch(function(err){
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

heroRouter.post('/', bodyParser, function(req, res){
  console.log('hit endpoint /api/hero POST');
  createHero(req.body).then(function(hero){
    res.status(200).json(hero);
  }).catch(function(err){
    res.sendError(err);
  });
});

heroRouter.get('/:id', bodyParser, function(req, res){
  debug('hit endpoint /api/hero GET');
  storage.fetchItem('hero', req.params.id).then(function(hero){
    res.status(200).json(hero);
  }).catch(function(err){
    res.sendError(err);
  });
});

heroRouter.get('/', function(req, res){
  const err = AppError.error400('bad request, no ID was provided');
  res.sendError(err);
});

heroRouter.put('/:id', bodyParser, function(req, res){
  console.log('hit endpoint /api/hero PUT');
  if(!req.body.name){
    const err = AppError.error400('bad request, no body provided');
    res.sendError(err);
  } else{
    storage.fetchItem('hero', req.params.id).then(function(hero){
      hero.name = req.body.name;
      res.status(200).json(hero);
    }).catch(function(err){
      res.sendError(err);
    });
  }
});

heroRouter.delete('/:id', function(req, res) {
  debug('hit endpoint /api/hero DELETE');
  storage.deleteItem('hero', req.params.id).then(function(hero){
    res.status(200).json(hero);
  }).catch(function(err){
    res.sendError(err);
  });
});
