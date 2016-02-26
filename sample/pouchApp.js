'use strict';

var express = require('express');
var  app = express();
var  PouchDB = require('pouchdb');
var  debug = require('debug')('salti-admin:pouchapi');

var path = require('path');
var adminAcl = require(path.join(__dirname, '../lib/index'));


var pouchOptions = {
  mode: 'minimumForPouchDB' //'fullCouchDB' //minimumForPouchDB
};

app.get('/admin/getsecret', function (req, res, next) {

  /**
   * HACK: for CORS support on this demo
   * TODO: caller verification is part of the mix....
   * 1. caller needs to be validated against whitelist; all other's are denied.
   * */
  //just get the caller and allow it...
  var caller = req.get('origin');
  /// TODO: this needs to be validated - the caller - and only allow whitelist ones
  res.header("Access-Control-Allow-Origin", caller);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var secret = app.get('secret');
  
  return res.status(200).send({
    success: true,
    message: 'secret-request',
    secret: secret
  });
})

adminAcl.generateSecret(function (err, secret) {

  console.log('***************************************');
  console.log('');
  console.log('Use THIS secret on the test page');
  console.log(secret);
  console.log('');
  console.log('***************************************');

  //also setting this in the App - see above for the API route
  app.set('secret', secret);
  
  //inject our middleware.. - needs to be BEFORE the express-pouchdb app setup.
  app.use(adminAcl.acl({ secret : secret }));

  app.use('/', require('express-pouchdb')(PouchDB, pouchOptions));
 
});


module.exports = app;

