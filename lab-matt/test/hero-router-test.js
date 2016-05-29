'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server');
const storage = require('../lib/storage');
const Hero = require('../model/hero');
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/hero`;

describe('testing module hero-router', function(){
  before((done)=>{
    if(!server.isRunning){
      server.listen(port, () =>{
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });
  after((done) => {
    if(server.isRunning){
      server.close(()=>{
        console.log('shutdown the server');
        done();
      });
      return;
    }
    done();
  });
  describe('testing GET /api/hero', function(){
    before((done) => {
      this.tempHero = new Hero('test Hero');
      storage.setItem('hero', this.tempHero);
      done();
    });
    after((done)=>{
      storage.pool = {};
      done();
    });
    it('should return a hero', (done)=> {
      request.get(`${baseUrl}/${this.tempHero.id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempHero.name);
        expect(res.body.id).to.equal(this.tempHero.id);
        done();
      });
    });
    it('should return status 404 for bad route', (done) => {
      request.get(`${baseUrl}/badroute`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return status 404 for id not found', (done) => {
      request.get(`${baseUrl}/128390128390218390`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('should return status 400 for no id provided', (done) => {
      request.get(baseUrl)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('testing POST and PUT at api/hero', function() {
    before((done) => {
      request.post(baseUrl).send({name: 'Captain Underpants'})
      .end((req, res)=>{
        this.res = res;
        this.hero = res.body;
        done();
      });
      after((done)=>{
        storage.pool = {};
        done();
      });
    });
    it('should return status code 200', () =>{
      expect(this.res.status).to.equal(200);
    });
    it('should return a hero', ()=>{
      expect(this.hero.name).to.equal('Captain Underpants');
    });
    it('should return a new name after PUT request is made', () =>{
      request.put(`${baseUrl}/${this.hero.id}`).send({name: 'Captain Mustard Pants'}).end((req, res) =>{
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Captain Mustard Pants');
      });
    });
    it('should return status code of 400 for bad request on PUT', (done) => {
      request.put(`${baseUrl}/${this.hero.id}`).end((req, res) =>{
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('testing bad POST request at api/hero', function(){
    before((done) =>{
      request.post(baseUrl).end((req, res) => {
        this.res = res;
        done();
      });
      after((done) =>{
        storage.pool = {};
        done();
      });
    });
    it('should return status code 400', ()=>{
      expect(this.res.status).to.equal(400);
    });
  });
});
