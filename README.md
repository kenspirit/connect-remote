**connect-remote** is a session store backed by any compatbile remote RESTful API service.

Setup
-----

```sh
npm install connect-remote express-session
```

Pass the `express-session` store into `connect-remote` to create a `RemoteStore` constructor.

```js
var session = require('express-session');
var RemoteStore = require('connect-remote')(session);

app.use(session({
    store: new RedisStore(options),
    secret: 'keyboard cat',
    resave: false
}));
```

Options
-------

A compatbile remote RESTful API URI is required. It is passed directly using the `uri` param.

- `uri` Remote service uri

The following additional params may be included:

-	`timeout` Value used for *timeout* option in [Request](https://github.com/request/request) (defaults to 100).


Compatbile remote RESTful API service
-----

This stores implement below functions:

* `destroy`: By `DELETE` method agasint uri `${uri}/${session_id}`.  
* `get`: By `GET` method agasint uri `${uri}/${session_id}`.  
* `set`: By `PUT` method agasint uri `${uri}/${session_id}` with session data as request body.  
* `all`: By `GET` method agasint uri `${uri}/`.  
* `clear`: By `DELETE` method agasint uri `${uri}/`.  
* `length`: By `GET` method agasint uri `${uri}/count`.  
* `touch`: By `POST` method agasint uri `${uri}/${session_id}` with session data as request body.  

All service response should be a JSON with `data` attribute that containing the result.  

```json
// RESTful API response sample for get method
{
    "data": {
        "cookie": {
            "originalMaxAge": 3600000,
            "expires": "2019-02-26T06:20:10.358Z",
            "httpOnly": true,
            "path": "/"
        }
    }
}

// RESTful API response sample for length method
{
    "data": 5
}
```

License
=======

MIT
