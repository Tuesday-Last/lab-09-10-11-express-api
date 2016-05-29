'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server');
const storage = require('../lib/storage');
const Npc = require('../model/npc');
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/npc`;

describe('testing module npc-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if (server.isRunning){
      server.close(() => {
        server.isRunning = false;
        console.log('server shutdown');
        done();
      });
      return;
    }
    done();
  });

  describe('testing post route api/npc', function(){
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return an npc', function(done){
      request.post(baseUrl)
      .send({name: 'Test Mctesty', race: 'Testor', classes: 'Test1'})
      .end((err, res) => {
        console.log('POST res.body.name', res.body.name);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Test Mctesty');
        expect(res.body.race).to.equal('Testor');
        expect(res.body.classes).to.equal('Test1');
        done();
      });
    });
  });
  describe('testing post route api/npc 400 Errors', function(){
    it('should return a 400 error', function(done){
      request.post(baseUrl)
      .end((err, res) => {
        console.log('POST error res.body.name', res.body.name);
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('bad request');
        done();
      });
    });
  });


  describe('testing get route api/npc', function(){
    before((done) => {
      this.tempNpc = new Npc('Temp Testy', 'test', 'Test2');
      storage.setNpc('npc', this.tempNpc);
      done();
      console.log('Storage.pool.npc', storage.pool.npc);
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return Temp Mctesty', (done) => {
      request.get(`${baseUrl}/${this.tempNpc.id}`)
      .end((err, res) => {
        console.log('GET res.body.name', res.body.name);
        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(this.tempNpc.id);
        expect(res.body.name).to.equal('Temp Testy');
        expect(res.body.classes).to.equal('Test2');
        done();
      });
    });

    it('should return 404', (done) => {
      request.get(`${baseUrl}/00000000000000`)
      .end((err, res) => {
        console.log('GET res.body.name', res.body.name);
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
    it('should return 404', (done) => {
      request.get(`${baseUrl}/`)
      .end((err, res) => {
        console.log('GET res.body.name', res.body.name);
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
  });

  describe('testing Put route api/npc', function(){
    before((done) => {
      this.tempNpc = new Npc('Temp Testy', 'test', 'Test2');
      storage.setNpc('npc', this.tempNpc);
      done();
      console.log('Storage.pool.npc', storage.pool.npc);
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return Temp Mctesty', (done) => {
      request.put(`${baseUrl}/${this.tempNpc.id}`)
      .send({name: 'Test Putesty', race: 'Testor', classes: 'Test3'})
      .end((err, res) => {
        console.log('POST res.body.name', res.body.name);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('Test Putesty');
        expect(res.body.race).to.equal('Testor');
        expect(res.body.classes).to.equal('Test3');
        done();
      });
    });
    it('should return 404', (done) => {
      request.put(`${baseUrl}/0000000000000`)
      .send({name: 'Test Putesty', race: 'Testor', classes: 'Test3'})
      .end((err, res) => {
        console.log('PUT res.body.name', res.body.name);
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
    it('should return 400', (done) => {
      request.put(`${baseUrl}/${this.tempNpc.id}`)
      .end((err, res) => {
        console.log('PUT res.body.name', res.body.name);
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('bad request');
        done();
      });
    });
  });
  describe('testing Delete route api/npc', function(){
    before((done) => {
      this.delNpc = new Npc('Doomed Tester', 'testX', 'Test4');
      storage.setNpc('npc', this.tempNpc);
      done();
      console.log('Storage.pool.npc', storage.pool.npc);
    });

    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return a 200', (done) => {
      request.delete(`${baseUrl}/${this.delNpc.id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
