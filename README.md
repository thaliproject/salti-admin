# SALTI-Admin
![Build Status](https://travis-ci.org/thaliproject/salti-admin.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/thaliproject/salti-admin/badge.svg?branch=master)](https://coveralls.io/github/thaliproject/salti-admin?branch=master)



## Simple Authentication/Authentication Library for Thali IoT
Provides a simple Express Middleware implementation that checks a simple Authorization header.

A supporting sample that utilizes [PouchDB](http://pouchdb.com/) and [express-pouchdb](https://github.com/pouchdb/express-pouchdb) 

## Using the library..

```
npm install --save salti-admin
```

### Server side setup.
You should have an Express site available.
```js
var adminAcl = require('salti-admin');
```

#### Determine a secret.  
You can use any secret - but, there is a utility method to generate one.

The example below - this generates a secret - then sets the secret for the `salti-admin` library, then also sets the Express app property (optional).

Then this inserts the middleware, and the final call here sets up `express-pouchdb` app.

```js

adminAcl.generateSecret(function (err, secret) {

  adminAcl.setSecret(secret);
  
  //also setting this in the App - see above for the API route
  app.set('secret', secret);
  
  //inject our middleware.. - needs to be BEFORE the express-pouchdb app setup.
  app.use(adminAcl.isAdminOk);

  app.use('/', require('express-pouchdb')(PouchDB, pouchOptions));
 
});

```

## Client setup

This just requires that the same secret is shared on the client.

For example, here we're setting the PouchDB client options.

The `secret` is the same from above with the word `CLEAR` as a prefix

```js
  pouchDbOptions.ajax.headers = {
    'User-Agent': 'request',
    'Authorization' : 'CLEAR ' + secret
  }
  
  var remoteDB = new PouchDB('https://localhost:3001/_validate', pouchDbOptions)
```



## Setting up..

- [ ] First - clone - then run `npm install` on both the root and the sample
- [ ] Then move to the directory
- [ ] run `npm install`
- [ ] run the tests with [mocha](http://mochajs.org/)
- [ ] move to the sample directory
- [ ] run `npm install`
- [ ] run the sample app



```
git clone https://github.com/cicorias/salti-admin
cd salti-admin
npm install
mocha
cd sample
npm install
node ./server.js


```
## Running Tests
You first should have mocha installed.

```js
npm install -g mocha
```

Then from the root, just run `mocha`


## Running solution
There is a sample solution that sets up 3 Express sites.

```
cd sample
npm install
node ./server
```

At this point, you have 3 sites running.

Go to the main site at [https://localhost:3000](https://localhost:3000)

From there other links are visible:
PouchDB / Fauxton site: [http://localhost:3002](http://localhost:3002)

## Validation Page.

Validation page demonstrates the creation of a document - check the code for the calling pattern.

The field that shows the current secret it set automatcially at startup.

Try a few "create docs" and you should see the response in the green box.

Then, change the key to something else - then again try to create docs - at this point you should see messages on each failure in the red box.