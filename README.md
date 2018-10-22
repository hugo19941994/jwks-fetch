# JWKs Fetch

[![Build Status](https://travis-ci.com/hugo19941994/jwks-fetch.svg?token=uZQLRmskW3ypFsCoHyMx&branch=master)](https://travis-ci.com/hugo19941994/jwks-fetch)
[![Coverage Status](https://coveralls.io/repos/github/hugo19941994/jwks-fetch/badge.svg?branch=master)](https://coveralls.io/github/hugo19941994/jwks-fetch?branch=master)

jwks-fetch is a NodeJS library which retrieves asymmetric keys in JWKs format. It supports both RSA and EC keys.

> npm install --save jwks-fetch

It implements a Promise based API. NoseJS 8 or above is required. For now it's only compatible with Node, but isomorphic support is planned.

```javascript
const {JWKSClient, HTTPError} = require('jwks-fetch');

const client = JWKSClient({ cache: true, ttl: 60, strictSSL: false });
const url = 'https://demo.com/static/jwks.json';
const kid = 'auth';

client.retrieve(url, kid)
    .then(r => {
        console.log(r);

        /*
         * -----BEGIN PUBLIC KEY-----
         * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA+Mv6SZ2mcGjVBwfAIfCZ
         * 9MjnMuJpKrSFCcLJQ44TIh01zmOogxvobC+tm4sv+hiJ8F9S7CDxVJ7Xs6JNV+I8
         * XgqK+ZfrjCLNTsuxv5Y/ByFaq0pjHmWa8mKfsQ389qo4AuoILaj40f1Ai4KXkjWu
         * UkKj1t+PAusOazpN3InOLHfUKWhXNMyWFuVfACDlHuOPq9wzbD+AmrM76GwY/xSO
         * DvtNCM4pSF4FWTBRTZhelr7POERxd5Lb2uZxfiXCcyLVNf7DTzHjPB40lyrQ+bv4
         * t5/FuaqMBMCtOPYNUqBwdQ79k3jJkPQNoyjuyXwzeP90jkBEZxmR/j/si56r0urQ
         * tQIDAQAB
         * -----END PUBLIC KEY-----
         */
    })
    .catch(err => {
        if (err instanceof HTTPError) {
            console.error(`status code ${err.status}`);
        }
        console.error(err);
    });
```

## Options

```javascript
{
    cache: false // Enable or disable cache
    ttl: 60, // Amount of time in seconds to cache a key
    strictSSL: true // Throw error if SSL certificate could not be validated
}
```

## HTTPError

If the `jwks_uri` didn't respond with an HTTP status code 200 a custom HTTPError exception will be thrown. From there you can access the raw response with `err.res` and the status code with `err.status`.

## Useful links

* [JSON Web Key](https://tools.ietf.org/html/rfc7517)
* [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518)
* [mkjwk](https://mkjwk.org/)
