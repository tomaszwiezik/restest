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
* `defaultContentType` - if provided then it is used as a `Content-Type` header in each request, unless specified otherwise in the request

> [!NOTE]
> It is still possible to use full URL in a request, even if `baseUrl` option is used. If the URL starts with the `baseUrl`, then the latter is ignored.

## Web requests

A generic function for sending requests:
```
Http.sendRequest(method, url, options);
```

There exist also a buch of helper functions:
```
Http.delete(url, options)    // equivalent of: Http.sendRequest('DELETE', url, options);
Http.get(url, options)       // equivalent of: Http.sendRequest('GET', url, options);
Http.options(url, options)   // equivalent of: Http.sendRequest('OPTIONS', url, options);
Http.patch(url, options)     // equivalent of: Http.sendRequest('PATCH', url, options);
Http.post(url, options)      // equivalent of: Http.sendRequest('POST', url, options);
Http.put(url, options)       // equivalent of: Http.sendRequest('PUT', url, options);
```


## Bearer authentication


## Assertions

