#!/usr/bin/env node

'use strict';

var debug = require('debug')('salti-admin:server');
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');


//this is our sample UI site on port https://localhost:3000
// the 2 express apps:
var webApp = require('./app');
var webAppPort = normalizePort(process.env.PORT || '3000');

var serverCommonOptions = {
  key: loadPEM('key'),
  cert: loadPEM('key-cert')
};

webApp.set('port', webAppPort);
var webServer = https.createServer(serverCommonOptions, webApp);
webServer.listen(webAppPort, function () {
  debug('webServer is listening on port %s', webAppPort);
});
webServer.on('error', onError);


// Here we will setup the Fauxton UI site - under
// http://localhost:3002

var pouchWeb = require('./fauxton');
var pouchWebPort = normalizePort(process.env.PORT || '3002');


pouchWeb.set('port', pouchWebPort);
var pouchWebServer = http.createServer(pouchWeb);
pouchWeb.listen(pouchWebPort, function () {
  debug('Fauxton UI web listening on port %s', pouchWebPort);
})
pouchWeb.on('error', onError);


// here is the Fauxton Site - using the generic site as an API endpoint
// which is then hosted using HTTPS/TLS

var pouchServerApp = require('./pouchApp');
var pouchAppPort = normalizePort("3001");

var serverOptions = {
  key: loadPEM('key'),
  cert: loadPEM('key-cert')
}

pouchServerApp.set('port', pouchAppPort);

/* 
 * generally, you call this ONCE per config as it's going to be a shared secret with the 
 * WebView Tier in Thali (the App)
 * 
 * This should probably be persisted in PochDB config land..
 * 
 * But for this demonstration, standalone it gets put here..
 * 
*/


var pouchServer = https.createServer(serverOptions, pouchServerApp);

pouchServer.listen(pouchAppPort, function () {
  debug('pouchServer API is listening on port %s', pouchAppPort);
  console.log('***************************************');
  console.log('');
  console.log('run a browser on https://localhost:3000');
  console.log('');
  console.log('***************************************');

});

pouchServer.on('error', onError);


// various utility functions...

// cert/pem loaders
function filenamePEM(n) {
  return require('path').join('./', n + '.pem');
}

function loadPEM(n) {
  return fs.readFileSync(filenamePEM(n));
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error, parent) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // var bind = typeof port === 'string'
  //   ? 'Pipe ' + port
  //   : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


