'use strict';

var crypto = require('crypto');
var debug = require('debug')('salti-admin:adminAcl');
var compare = require('secure-compare');

var self = {};
module.exports = exports = self;

module.exports.SECRET_SIZE = 16;

module.exports.setSecret = function (secret, prefix) {
  debug('setting secret');
  if (!prefix)
    self._secret = 'CLEAR ' + secret;
  else
    self._secret = secret;
};

module.exports.getSecret = function () {
  debug('returning secret');
  return self._secret;
};

module.exports.generateSecret = function (callback) {
  crypto.randomBytes(module.exports.SECRET_SIZE, function (ex, buf) {
    if (ex)
      callback(ex);

    callback(null, buf.toString('base64'));
  });
};

module.exports.isAdminOk = function isAdminOk(req, res, next) {
  debug('inside of the middleware headerCheck');

  var msg401 = { success: false, message: 'Unauthorized' };

  if (!req.headers) {
    debug('no headers found - misconfiguration probably');
    return res.status(401).send(msg401);
  }
  else if (!req.headers.authorization) {
    debug('no authorization header found');
    return res.status(401).send(msg401);
  }
  else {
    debug('we have a token it seems');
    var token = req.headers.authorization;
    if (!self._secret) {
      debug('there is no _secret');
      return res.status(401).send(msg401);
    }
    else if ( ! compare(token,self._secret)) {
      debug('failed on secret match');
      return res.status(401).send(msg401);
    }
    else {
      next();
    }
  }
};

