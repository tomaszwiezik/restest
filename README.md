# Summary

Node.js based web API tester utility. Available javascript modules are the following:
* `diagnostics.mjs` - assertions, classes: `Assert`
* `restest.mjs` - HTTP client and authorization, classes: `Http`, `BearerAuthentication`


# Usage

## Syntax

```
node myscript.mjs
```

If the script fails, the error message is written to the error and error code is returned:
```
node myscript.mjs
IF ERRORLEVEL 1 ECHO Script executed wiht error
```

## Web client configuration

```
import { Http, BearerAuthentication } from './restest/restest.mjs';
import { Assert } from '../restest/diagnostics.mjs';

const http = new Http({
    baseUrl: 'http://localhost:5002/api',
    defaultContentType: 'application/json; charset=UTF-8'
});
```

Imports:
* `Http` - the web client
* `BearerAuthentication` - optional, bearer authentication
* `Asser` - optional, assertions

Http client creation options:
* `baseUrl` - if provided, then relative URLs can be used in requests
* `defaultContentType` - if provided then it is used as a `Content-Type` header with each request, unless specified otherwise in the request

## Web requests


## Bearer authentication


## Assertions

