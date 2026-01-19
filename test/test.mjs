import { Http, Args, BearerAuthentication } from '../src/restest.mjs';
import { Assert, Doc } from '../src/diagnostics.mjs';


// Arguments
console.log(Args);


// Documentation
Doc.summary(`
	Multiline
	summary text.`);
Doc.text(`
	Multiline
	text.`);
Doc.todo('Task text');


// HTTP requests
const http1 = new Http({
    acceptSelfSignedCertificate: true,
    baseUrl: 'http://some.url/api',
    defaultContentType: 'application/json; charset=UTF-8'
});

const http2 = new Http({
    acceptSelfSignedCertificate: true,
    baseUrl: Args.baseUrl,
    defaultContentType: 'application/json; charset=UTF-8'
});


{
	const response = http1.get('/endpoint');
}
