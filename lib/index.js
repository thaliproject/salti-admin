'use strict';

var crypto = require('crypto');
var debug = require('debug')('salti-admin:adminAcl');
var secureCompare = require('secure-compare');

module.exports.SECRET_SIZE = 16;
module.exports.DEFAULT_PREFIX = 'CLEAR ';
 
/* Utility Method */
module.exports.generateSecret = function (callback) {
  crypto.randomBytes(module.exports.SECRET_SIZE, function (ex, buf) {
    if (ex)
      callback(ex);

    callback(null, buf.toString('base64'));
  });
};

/* the Middleware */
function adminAcl(options) {
  var opts = options || {};

  if (!opts.secret) {
    throw new Error('missing secret');
  }

  var expectedHeader;
  if (opts.prefix) {
    expectedHeader = opts.prefix + ' ' + opts.secret;
  }
  else {
    expectedHeader = module.exports.DEFAULT_PREFIX + opts.secret;
  }

  return function (req, res, next) {
    debug('inside of the middleware headerCheck');

    var msg401 = { success: false, message: 'Unauthorized' };

    if (!req.headers) {
      debug('no headers found - misconfiguration probably');
      return res.status(401).send(msg401);
    }
    
    if (!req.headers.authorization) {
      debug('no authorization header found');
      return res.status(401).send(msg401);
    }

    debug('we have a token it seems');
    var receivedHeader = req.headers.authorization;

    if (secureCompare(receivedHeader, expectedHeader)) {
      next();
    }
    else {
      debug('failed on secret match');
      return res.status(401).send(msg401);
    }
  };
}

module.exports.acl = adminAcl;

