
'use strict';

var assert = require('assert'),
  path = require('path'),
  crypto = require('crypto');

var adminAcl = require(path.join(__dirname, '../lib/index'));

describe('some generate secret tests', function () {
  describe('generate random bytes', function () {
    it('should not be null', function (done) {
      adminAcl.generateSecret(function (err, result) {
        assert(result, 'result is null');
        console.log('result: %s', result);
        done();
      });
    })
  })

  describe('generate random bytes', function () {
    it('should be some base64 string', function (done) {
      adminAcl.generateSecret(function (err, result) {
        assert(result, 'result is null');
        var newbuff = new Buffer(result, 'base64');
        assert.equal(newbuff.toString('base64'), result);
        done();
      });
    })
  })

  describe('generate random bytes', function () {
    it('should fail match with mangled base64 string', function (done) {
      adminAcl.generateSecret(function (err, result) {
        assert(result, 'result is null');
        var newbuff = new Buffer(result + 'z', 'base64');
        assert.notEqual(newbuff.toString('base64', result));
        done();
      });
    })
  })

  describe('generate random bytes', function () {
    it('buffer should be size requested', function (done) {
      adminAcl.generateSecret(function (err, result) {
        var newbuff = new Buffer(result, 'base64');
        assert.equal(adminAcl.SECRET_SIZE, newbuff.length);
        done();
      });
    })
  })

})
