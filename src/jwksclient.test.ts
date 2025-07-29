import { readFileSync } from 'fs';
import { fetch } from 'undici';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import HTTPError from '../src/errors';
import { JWKSClient } from '../src/jwksclient';

vi.mock('undici');
const mockedFetch = vi.mocked(fetch);

beforeEach(() => {
    mockedFetch.mockClear();
});

test('fetch RSA key (which contains a kid) with kid', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return RSPubJWKId1;
            },
            status: 200,
        }) as any
    );

    const client = new JWKSClient({ strictSSL: false });
    expect(await client.retrieve('https://test.com/jwks.json', 'si_authentication')).toEqual(RSAPubKey1);
});

test("if kid is given fetching an RSA key (which doesn't contain a kid) should throw", async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return RSPubJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({});
    await expect(client.retrieve('https://test.com/jwks.json', 'si_authentication')).rejects.toThrowError(Error);
});

test("fetch RSA key (which doesn't contain a kid) without kid", async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return RSPubJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({});
    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(RSAPubKey1);
});

test('fetch EC key (which contains a kid) with kid', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return ECPubJWKId1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({});
    expect(await client.retrieve('https://test.com/jwks.json', 'si_authentication')).toEqual(ECPubKey1);
});

test('fetch EC key (which contains a kid) without kid', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return ECPubJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({});
    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);
});

test('make sure caching works when enabled', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return ECPubJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);
    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);
    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);

    expect(mockedFetch.mock.calls.length).toEqual(1);
});

test('if caching is disabled make sure we hit the API every time', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return ECPubJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: false });

    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);
    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);
    expect(await client.retrieve('https://test.com/jwks.json')).toEqual(ECPubKey1);

    expect(mockedFetch.mock.calls.length).toEqual(3);
});

test('search with kid', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return MixPubJWKId1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: false });

    expect(await client.retrieve('https://test.com/jwks.json', 'kid1')).toEqual(ECPubKey1);
    expect(await client.retrieve('https://test.com/jwks.json', 'kid2')).toEqual(RSAPubKey1);
});

test('HTTPError if status !== 200', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return MixPubJWKId1;
            },
            status: 404
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'kid1')).rejects.toThrowError(HTTPError);
});

test('HTTPError if fetch throws', async () => {
    mockedFetch.mockImplementation(() => Promise.reject('exception'));

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'kid1')).rejects.toThrowError(HTTPError);
});

test('No kid or alg with multiple JWKs should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return MixPubJWKId1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json')).rejects.toThrow(Error);
});

test('Invalid kid should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return MixPubJWKId1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'error')).rejects.toThrow(Error);
});

test('Empty JWKs should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return { keys: [] };
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'error')).rejects.toThrow(Error);
});

test('Invalid JWKs should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return {};
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'error')).rejects.toThrow(Error);
});

test('Invalid JWKs should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return { test: 'test' };
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'error')).rejects.toThrow(Error);
});

test('Invalid JWKs should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return { keys: [{ kid: 'test' }] };
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'test')).rejects.toThrow(Error);
});

test('Symmetric keys should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return SymmetricJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(
        client.retrieve('https://test.com/jwks.json', 'HMAC key used in JWS spec Appendix A.1 example')
    ).rejects.toThrow(Error);
});

test('Repeated kids should throw', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return RepeatedJWK1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    await expect(client.retrieve('https://test.com/jwks.json', 'kid1')).rejects.toThrow(Error);
});

test('URL is obligatory', async () => {
    mockedFetch.mockImplementation(() =>
        Promise.resolve({
            json: () => {
                return MixPubJWKId1;
            },
            status: 200
        }) as any
    );

    const client = new JWKSClient({ cache: true });

    // @ts-ignore
    await expect(client.retrieve(undefined, 'kid1')).rejects.toThrow(Error);
});

const RSAPubKey1 = readFileSync('src/fixtures/PEMs/RSAPubKey1.pem', 'utf8');
const ECPubKey1 = readFileSync('src/fixtures/PEMs/ECPubKey1.pem', 'utf8');

const ECPubJWK1 = JSON.parse(readFileSync('src/fixtures/JWKs/ECPubJWK1.json', 'utf8'));
const ECPubJWKId1 = JSON.parse(readFileSync('src/fixtures/JWKs/ECPubJWKId1.json', 'utf8'));
const RSPubJWK1 = JSON.parse(readFileSync('src/fixtures/JWKs/RSPubJWK1.json', 'utf8'));
const RSPubJWKId1 = JSON.parse(readFileSync('src/fixtures/JWKs/RSPubJWKId1.json', 'utf8'));
const MixPubJWKId1 = JSON.parse(readFileSync('src/fixtures/JWKs/MixPubJWKId1.json', 'utf8'));
const SymmetricJWK1 = JSON.parse(readFileSync('src/fixtures/JWKs/SymmetricJWK1.json', 'utf8'));
const RepeatedJWK1 = JSON.parse(readFileSync('src/fixtures/JWKs/RepeatedPubJWKId1.json', 'utf8'));
