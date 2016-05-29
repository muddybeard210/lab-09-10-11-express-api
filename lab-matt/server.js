'use strict';

const debug = require('debug')('hero:server');
const express = require('express');
const morgan = require('morgan');
const heroRouter = require('./route/hero-router');
const errorResponse = require('./lib/error-response');
const port = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(errorResponse);
app.use('/api/hero', heroRouter);

app.all('*', function(req, res){
  debug('* 404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app up on port', port);
});

server.isRunning = true;
module.exports = server;
