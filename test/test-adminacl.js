'use strict';

var request = require('supertest'),
  express = require('express'),
  path = require('path');

var adminAcl = require(path.join(__dirname, '../lib/index'));

describe('basic authn tests', function () {

  var app;
  before(function () {
    app = express();

    app.use(adminAcl.acl({ secret: 'foobar' }));
    app.get('/', function (req, res) {
      console.log('in the handler for get');
      res.status(200).json({ message: 'you made it' });
    });

    app.post('/', function (req, res) {
      console.log('in the post handler');
      res.status(200).json({ name: 'you made it' });
    });
  })

  describe('no header tests', function (done) {
    describe('GET / with no header', function (done) {
      it('respond with an access denied - 401', function (done) {
        request(app)
          .get('/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })

    describe('POST / with no header', function (done) {
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

  describe('crypto authn tests - caller lacks CLEAR in header', function () {

    describe('simple Authn with binary call', function () {
      it('respond with an 401 - unauthorized', function (done) {
        request(app)
          .post('/')
          .set('Authorization', 'foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })


    describe('simple Authn with binary call', function () {
      it('respond with an 401 - unauthorized', function (done) {
        request(app)
          .post('/')
          .set('Authorization', 'foobar')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, done);
      })
    })

  })

  describe('some tests with a req.body', function () {
    var secret = 'truk653Dimohr/0D7IDuPg==THISDOESNTMATTER';

    var app;
    before(function () {
      app = express();

      app.use(adminAcl.acl({ secret: secret }));
      app.get('/', function (req, res) {
        console.log('in the handler for get');
        res.status(200).json({ message: 'you made it' });
      });

      app.post('/', function (req, res) {
        console.log('in the post handler');
        res.status(200).json({ name: 'you made it' });
      });
    })

    it('should reject as invalid header', function (done) {
      request(app)
        .post('/')
        .send({ name: 'Manny', species: 'cat' })
        .set('Authorization', 'foobar')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    })

    it('should reject as invalid header', function (done) {
      request(app)
        .get('/')
        .send({ name: 'Manny', species: 'cat' })
        .set('Authorization', 'foobar')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    })

    it('should OK as valid header', function (done) {
      request(app)
        .post('/')
        .send({ name: 'Manny', species: 'cat' })
        .set('Authorization', 'CLEAR ' + secret)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })


    it('should OK as valid header', function (done) {
      request(app)
        .get('/')
        .send({ name: 'Manny', species: 'cat' })
        .set('Authorization', 'CLEAR ' + secret)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })


  })

})
