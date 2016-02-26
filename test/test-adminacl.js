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

describe('basic authn tests', function () {

  before(function () {
    adminAcl.setSecret('foobar');
    // app.set('adminAclSecret', 'foobar');
  })

  describe('no header tests', function () {
    describe('GET / with no header', function () {
      it('respond with an access denied - 401', function (done) {
        request(app)
          .get('/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })

    describe('POST / with no header', function () {
      it('respond with an access denied - 401', function (done) {
        request(app)
          .post('/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })
  })

  describe('with simple Authorization header no clear', function () {
    describe('GET / ', function () {
      it('respond with an 401', function (done) {
        request(app)
          .get('/')
          .set('Authorization', 'foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })

    describe('POST / ', function () {
      it('respond with a 401', function (done) {
        request(app)
          .post('/')
          .set('Authorization', 'foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })
  });

  describe('with mismatch Authorization header', function () {
    describe('GET / ', function () {
      it('respond with an access denied - 401', function (done) {
        request(app)
          .get('/')
          .set('Authorization', 'Foobarz')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })

    describe('POST / ', function () {
      it('respond with a - 401', function (done) {
        request(app)
          .post('/')
          .set('Authorization', 'Foobarz')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })
  });

  describe('with CLEAR in Authorization header', function () {
    describe('GET / ', function () {
      it('respond with an OK - 200', function (done) {
        request(app)
          .get('/')
          .set('authorization', 'CLEAR foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      })
    })

    describe('POST / ', function () {
      it('respond with an OK - 200', function (done) {
        request(app)
          .post('/')
          .set('authorization', 'CLEAR foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      })
    })

  })


})
