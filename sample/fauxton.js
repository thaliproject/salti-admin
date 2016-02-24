'use strict';

var express = require('express');
var app = express();
var PouchDB = require('pouchdb');
var debug = require('debug')('salti-admin:fauxton');

var pouchOptions = {
  mode: 'fullCouchDB'
};

app.use('/', require('express-pouchdb')(PouchDB, pouchOptions));

module.exports = app;

