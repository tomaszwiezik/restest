/*
* (C) Tomasz Wiezik
* Version: 1.1.1
*/

export class BearerAuthentication {
    constructor(token) {
        this.#token = token;
    }

    #token = undefined;


    getHeaders() {
        return this.#token ? {
            'Authorization': `Bearer ${this.#token}`
        } : {};
    }
}


export class Http {
    constructor(options) {
        this.#baseUrl = options?.baseUrl ? options?.baseUrl : '';
        this.#defaultContentType = options?.defaultContentType ? options?.defaultContentType : '';
        if (options?.acceptSelfSignedCertificate === true) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
    }

    #baseUrl = undefined;
    #defaultContentType = undefined;
    #authentication = undefined;


    authentication(authenticationMethod) {
        this.#authentication = authenticationMethod;
    }


	async sendRequest(method, url, options) {
		const startTime = new Date();
		
        const request = this.#getRequest(method, options);
        await this.#showRequest(url, request);
		
		const response = await fetch(this.#getFullUrl(url), request);
        switch (response.headers.get('content-type')?.toLowerCase()) {
            case 'application/json; charset=utf-8': response.payload = await response.json(); break;
            default:                                response.payload = await response.text(); break;
        }
        response.header = {
            contentType: response.headers.get('content-type'),
            location: response.headers.get('location'),
        };
        response.cookies = {};
        if (response.headers.get('set-cookie')) {
            const cookies = response.headers.get('set-cookie').split(',');
            for (let i = 0; i < cookies.length; i++) {
                cookies[i] = cookies[i].trim();
                cookies[i] = cookies[i].split(';', 1)[0];
                const cookie = cookies[i].split('=', 2);
                response.cookies[cookie[0]] = cookie[1];
            }
        }
		response.duration = (new Date()) - startTime;
        await this.#showResponse(response);

        return response;
	}

	delete = (url, options) => this.sendRequest('DELETE', url, options);
	get = (url, options) => this.sendRequest('GET', url, options);
	options = (url, options) => this.sendRequest('OPTIONS', url, options);
	patch = (url, options) => this.sendRequest('PATCH', url, options);
	post = (url, options) => this.sendRequest('POST', url, options);
	put = (url, options) => this.sendRequest('PUT', url, options);


    #getFullUrl = (url) => url.startsWith(this.#baseUrl) ? url : `${this.#baseUrl}${url}`;


    #getRequest(method, options) {
        const request = {
			method: method,
			body: options?.body,
			headers: {}
		};
        if (options?.body) {
            if (this.#defaultContentType) {
                request.headers['Content-type'] = this.#defaultContentType;
            }
            if (this.#defaultContentType?.toLowerCase().startsWith('application/json;')) {
                request.body = JSON.stringify(request.body);
            }    
        }
        for (const headerName in options?.headers) {
            request.headers[headerName] = options.headers[headerName];
        }
        if (this.#authentication) {
            const authenticationHeaders = this.#authentication.getHeaders();
            for (const headerName in authenticationHeaders) {
                request.headers[headerName] = authenticationHeaders[headerName];
            }
        }
        return request;
    }


    async #showRequest(url, request) {
        console.log('');
        console.log(`--> REQUEST: ${request.method} ${this.#getFullUrl(url)}`);
        console.log('headers:');
        for (const property in request.headers) {
            console.log(`  ${property}: ${request.headers[property]}`);
        }
        if (request.body) {
            console.log('payload:');
            if (request.headers['Content-type']?.toLowerCase().startsWith('application/json;')) {
                console.log(JSON.parse(request.body));    
            }
            else {
                console.log(request.body);
            }    
        }

        return request;
    }


    async #showResponse(response) {
        console.log('');
        console.log(`<-- RESPONSE: ${response.status} (${response.statusText}), duration: ${response.duration} ms`);
        console.log('headers:');
        response.headers.forEach((value, key, map) => {
            console.log(`  ${key}: ${value}`);
        });
        if (response.payload) {
            console.log('payload:');
			console.log(JSON.stringify(response.payload, null, 2))
        }
        if (response.cookies) {
            console.log('cookies:');
            for (let name in response.cookies) {
                console.log(`  ${name}: ${response.cookies[name]}`);
            }
        }
        console.log('');

        return response;
    }


}
