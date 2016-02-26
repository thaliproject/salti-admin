'use strict';
/* this is just split into 2 for size of file reasons*/

var assert = require('assert'),
  path = require('path'),
  compare = require('secure-compare');

var adminAcl = require(path.join(__dirname, '../lib/index'));

describe('some setting and getting tests', function () {
  describe('simple set and get secret validation', function () {
    it('should match our expected header', function (done) {
      var actual = 'foobar';
      var expected = 'CLEAR' + ' ' + actual;
      adminAcl.setSecret(actual);
      var result = adminAcl.getHeader();
      assert.equal(expected, result);
      done();
    })
  })


  describe('generate a secret and set it', function () {
    it('should match the header we EXPECT', function (done) {
      adminAcl.generateSecret(function (err, result) {
        adminAcl.setSecret(result);
        var expected = 'CLEAR ' + result;
        var actual = adminAcl.getHeader();
        assert.equal(expected, actual);
        done();
      });
    })
  })
})





