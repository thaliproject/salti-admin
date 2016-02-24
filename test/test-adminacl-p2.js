'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path');

var app = express();

var adminAcl = require(path.join(__dirname, '../lib/index'));

app.use(adminAcl.isAdminOk);

app.get('/', function (req, res) {
  console.log('in the handler for get');
  res.status(200).json({ message: 'you made it' });
});

app.post('/', function (req, res) {
  res.status(200).json({ name: 'you made it' });
});

describe('crypto authn tests', function () {

  before(function () {
    adminAcl.setSecret('foobar');
  })

  describe('simple Authn with binary call', function(){
      it('respond with an 401 - unauthorized', function (done) {
        request(app)
          .get('/')
          .set('Authorization', 'foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
  })
  
  
  describe('simple Authn with binary call', function(){
      it('respond with an 401 - unauthorized', function (done) {
        request(app)
          .get('/')
          .set('Authorization', 'foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
  })

})
  