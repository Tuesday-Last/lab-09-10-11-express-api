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
        done();
      });
    });
  });

  describe('testing get route api/npc', function(){
    before((done) => {
      this.tempNpc = new Npc('Temp Mctesty', 'test', 'Test2');
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
        expect(res.body.name).to.equal('Temp Mctesty');
        expect(res.body.classes).to.equal('Test2');
        done();
      });
    });
  });
});
