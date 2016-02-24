var debug = require('debug')('salti-admin:validate');
var express = require('express');
var router = express.Router();

var PouchDB = require('pouchdb');

var pouchDbOptions = { ajax : {
     agentOptions:{
       rejectUnauthorized: false
     }            
}};


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('validate', { title: 'SALTI-Admin Validate Page' });
});

router.post('/', function (req, res, next) {
  if (! req.body.doc) {
    debug('invalid request on post - missing doc');
    return res.status(400).send ({ error: 'invalid request - missing doc'});
  }
 
  if (! req.body.secret) {
    debug('no secret provided - continuing...');
  }
   
  var secret = req.body.secret; 
  var theDoc = JSON.parse (req.body.doc);
  
  debug('PUT a newdoc: ' + JSON.stringify(theDoc));
   
  pouchDbOptions.ajax.headers = {
    'User-Agent': 'request',
    'Authorization' : secret
  }
  
  var remoteDB = new PouchDB('https://localhost:3001/_validate', pouchDbOptions)
  
  remoteDB.put(theDoc, function (err, response) {
    if (err) {
      debug(err);
      
      return res.status(500).send( { error: err, message: 'failed to put new doc' });
    }
      return res.status(200).send( response );
  });

})

module.exports = router;
