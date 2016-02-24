
'use strict';

var assert = require('assert'),
    path = require('path'),
    crypto = require('crypto');

var adminAcl = require(path.join(__dirname, '../lib/index'));

describe('generate random bytes', function () {
  it('some base64 string', function (done) {
    adminAcl.generateSecret( function (err, result){
       assert(result, 'result is null');
       console.log('result: %s', result);
       done();
    });
  })
})

describe('generate random bytes', function () {
  it('some base64 string', function (done) {
    adminAcl.generateSecret( function (err, result){
       assert(result, 'result is null');
       var newbuff = new Buffer(result, 'base64');
       assert.equal(newbuff.toString('base64'), result);
       done();
    });
  })
})

describe('generate random bytes', function () {
  it('some base64 string', function (done) {
    adminAcl.generateSecret( function (err, result){
       assert(result, 'result is null');
       var newbuff = new Buffer(result + 'z', 'base64');
       assert.notEqual(newbuff.toString('base64', result));
       done();
    });
  })
})
