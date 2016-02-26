'use strict';

var express = require('express');
var app = express();
var PouchDB = require('pouchdb');
var debug = require('debug')('salti-admin:fauxton');

var minPouchOptions = {
    mode: 'minimumForPouchDB',
  overrideMode: {
    include: ['routes/fauxton']
  }
}

app.use('/', require('express-pouchdb')(PouchDB, minPouchOptions));

module.exports = app;



