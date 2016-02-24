'use strict';

var crypto = require('crypto');

var debug = require('debug')('salti-admin:adminAcl');

var self = {};
module.exports = exports = self;

exports.SECRET_SIZE = 16;

exports.setSecret = function (secret, prefix) {
  debug('setting secret');
  if (!prefix)
    self._secret = 'CLEAR ' + secret;
  else
    self._secret = secret;
}

exports.getSecret = function () {
  debug('returning secret');
  return self._secret;
}

exports.generateSecret = function ( next ) {
  crypto.randomBytes(exports.SECRET_SIZE, function (ex, buf) {
    if (ex) next(ex);// throw ex;
    next(null, buf.toString('base64'));
  });
}

exports.isAdminOk = function isAdminOk(req, res, next) {
  debug('inside of the middleware headerCheck');

  if (!req.headers) throw new Error('no header is present');

  if (!req.headers['authorization']) {
    debug('no authorization header found');
    return res.status(401).send({
      success: false,
      message: 'No Authorization header provided.'
    });
  }
  else {
    var token = req.headers['authorization'];
    var app = req.app;
    if (!self._secret)
      self._secret = app.get('adminAclSecret');

    if (!self._secret) throw new Error('invalid library configuration - missing secret');

    debug('appSecret is: ' + self._secret);
    debug('token is ' + token);

    if (token != self._secret) {
      debug('failed on secret match');
      return res.status(401).send({
        success: false,
        message: 'No Authorization header provided.'
      });
    }
    else {

      var parts = token.toString('utf8').split(' ', 2);//
      //  new Buffer(token, 'base64').toString('utf8').split(' ', 2);
      
      debug('parts.');
      debug(parts[0]);
      debug(parts[1]);


      next();
    }
  };
}

