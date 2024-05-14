# Summary

Node.js based web API tester utility. Available javascript modules are the following:
* `diagnostics.mjs` - assertions, classes: `Assert`
* `restest.mjs` - HTTP client and authorization, classes: `Http`, `BearerAuthentication`


# Usage

## Syntax

```
node myscript.mjs
```

If the script fails, the error message is written to the error output and the error code 1 is returned:
```
node <myscript>.mjs
IF ERRORLEVEL 1 ECHO Script executed wiht error
```

## Web client configuration

```
import { Http, BearerAuthentication } from './restest/restest.mjs';
import { Assert } from '../restest/diagnostics.mjs';

const http = new Http({
    acceptSelfSignedCertificate: true,
    baseUrl: 'http://some.url/api',
    defaultContentType: 'application/json; charset=UTF-8'
});
```

Imports:
* `Http` - the web client
* `BearerAuthentication` - optional, bearer authentication
* `Asser` - optional, assertions

Http client creation options:
* `acceptSelfSignedCertificate` - set to `true` to accept self-signed certificate; not recommended in production environment
* `baseUrl` - if provided, then relative URLs can be used in requests
* `defaultContentType` - if provided then it is used as a `Content-Type` header in each request, unless specified otherwise in the request

> [!NOTE]
> It is still possible to use full URL in a request, even if `baseUrl` option is used. If the URL starts with the `baseUrl`, then the latter is ignored.


## Web requests

A generic function for sending requests:
```
Http.sendRequest(method, url, options);
```

It returns a `response` object (as retured by `fetch`), but extended with a few new properties:
* `payload` - the response body; if `Content-Type` header is `application/json`, then parsed response JSON is stored here, otherwise it's the response body in textual form
* `response.header.contentType` - the value of `Content-Type` header, if one exists
* `response.header.location` - the value of `Location` header, if one exists

There also exist a buch of helper functions:
```
Http.delete(url, options)    // equivalent of: Http.sendRequest('DELETE', url, options);
Http.get(url, options)       // equivalent of: Http.sendRequest('GET', url, options);
Http.options(url, options)   // equivalent of: Http.sendRequest('OPTIONS', url, options);
Http.patch(url, options)     // equivalent of: Http.sendRequest('PATCH', url, options);
Http.post(url, options)      // equivalent of: Http.sendRequest('POST', url, options);
Http.put(url, options)       // equivalent of: Http.sendRequest('PUT', url, options);
```

### Example

In the example every request is enclosed with curly braces `{...}`, making the `response` limited to that scope.

```
import { Http } from './restest/restest.mjs';

const http = new Http({
    baseUrl: 'http://some.url/api',
    defaultContentType: 'application/json; charset=UTF-8'
});

{
    // baseUrl is used, the full URL is 'http://some.url/api/login'
    // defaultContentType is sent in Content-Type header
    const response = await http.post('/login', {
        body: {
            username: "username",
            password: "password"
        }
    });
}
{
    // baseUrl is ignored
    // defaultContentType is sent in Content-Type header
    const response = await http.post('http://some.url/api/login', {
        body: {
            username: "username",
            password: "password"
        }
    });
}
{
    // baseUrl is ignored
    // Content-Type header is specified, so the defaultContentType is ignored
    const response = await http.post('http://some.url/api/login', {
        body: 'some text',
        headers: {
            "Content-Type": "plain/text"
        }
    });
}
{
    const response = await http.get('/data');
}
```


## Bearer authentication

```
import { Http, BearerAuthentication } from '../restest/restest.mjs';

const http = new Http({
    baseUrl: 'http://some.url/api',
    defaultContentType: 'application/json; charset=UTF-8'
});


{
    const response = await http.post('/login', {
        body: {
            username: "username",
            password: "password"
        }
    });
    // The response: { "token": "kl43h54h5k4j3h5kj34h5k3" }
    http.authentication(new BearerAuthentication(response.payload.token));
    // Since now on, all subsequent request headers will be appended with `Authorization: Bearer kl43h54h5k4j3h5kj34h5k3`
}

// To disable authentication
http.authentication(undefined);
```


## Assertions

Assertions are available as static methods of the `Assert` class, which must be imported from `diagnostics.mjs` module. If an assertion fails, the execution of the script is interrupted and the error code is returned.

The following assertions can be used (`message` is always optional):
* `Assert.areEqual(expected, actual, message)` - fails when `expected` <> `actual`
* `Assert.areNotEqual(notExpected, actual, message)` - fails when `notExpected` == `actual`
* `Assert.isTrue(condition, message)` - fails when `condition` is false
* `Assert.isFalse(condition, message)` - fails when `condition` is true

### Example

```
import { Http } from '../restest/restest.mjs';
import { Assert } from '../restest/diagnostics.mjs';

const http = new Http();

{
    const response = await http.get('http://some.url/api/data');

    // All assertions should pass when the response HTTP status code is 200
    Assert.areEqual(200, response.status, 'HTTP status code');
    Assert.areNotEqual(500, response.status, 'HTTP status code');
    Assert.isTrue(response.status == 200, 'HTTP status code');
    Assert.isFalse(response.status != 200, 'HTTP status code');
}
```