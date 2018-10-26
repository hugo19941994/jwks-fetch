import { Agent } from 'https';
// @ts-ignore
import jwkToPem from 'jwk-to-pem';
import fetch, { FetchError } from 'node-fetch';
import { Cache } from './cache';
import HTTPError from './errors';

interface IOptions {
    cache?: boolean;
    ttl?: number;
    strictSSL?: boolean;
}

export class JWKSClient {
    private cache: Cache;
    private agent: Agent;
    private caching: boolean;

    constructor(options: IOptions) {
        this.caching = options.cache == null ? false : options.cache;
        this.cache = new Cache(options.ttl || 60);

        this.agent = new Agent({ rejectUnauthorized: options.strictSSL == null ? true : options.strictSSL });
    }

    /*
     * Public method to retrieve a key from a JWKs
     */
    public async retrieve(url: string, kid?: string): Promise<string> {
        if (!url) {
            throw new Error('A URL is obligatory');
        }

        // If caching was enabled try to retrieve the key from the cache
        if (this.caching) {
            const cachedValue = this.cache.get(url + kid);
            if (cachedValue != null) {
                return cachedValue;
            }
        }

        // GET the remote key
        return await this.getFromURL(url, kid);
    }

    /*
     * Retrieve a key from a remote URL
     */
    private async getFromURL(url: string, kid?: string): Promise<string> {
        const res = await fetch(url, { agent: this.agent });

        if (res.status < 200 || res.status >= 300) {
            throw new HTTPError(res, `URL ${url} did not return 2XX`);
        }

        const jwks = await res.json();

        if (!jwks.keys) {
            throw new Error('Invalid JWKs format');
        }

        // each key SHOULD use a distinct kid, but if two keys use distinct kty/alg the same kid could be used
        // if only one key is present kid is not obligatory
        const key = this.findKey(jwks.keys, kid);

        const pem = jwkToPem(key);

        if (this.caching) {
            this.cache.set(url + kid, pem);
        }

        return pem;
    }

    /*
     * Select a key from a list of JWK
     */
    private findKey(keys: any[], kid?: string): object {
        if (keys.length === 0) {
            throw new Error('Empty JWKs');
        }

        if (keys.length === 1 && !kid) {
            return keys[0];
        }

        // If no kid is present only one key must be present inside the JWKs
        if (!kid) {
            throw new Error('a kid is required, as more than one JWK was retrieved');
        }

        keys = keys.filter(k => k.kid === kid);

        if (keys.length === 0) {
            throw new Error(`No keys matching kid ${kid} were found`);
        }

        if (keys.length > 1) {
            throw new Error(`More than one key with specified kid were found`);
        }

        return keys[0];
    }
}
