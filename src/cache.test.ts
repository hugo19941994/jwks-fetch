import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Cache } from '../src/cache';

test('null if key is not found', () => {
    const client = new Cache(60);
    expect(client.get('test')).toEqual(null);
});

test('getting a value which was previously set', () => {
    const client = new Cache(60);
    client.set('key', 'value');
    expect(client.get('key')).toEqual('value');
});

test('values are deleted after the timeout', () => {
    vi.useFakeTimers();
    const client = new Cache(1);

    Date.now = vi.fn(() => 0);
    client.set('key', 'value');

    Date.now = vi.fn(() => 500);
    expect(client.get('key')).toEqual('value');

    Date.now = vi.fn(() => 2000);
    vi.runAllTimers();
    expect(client.get('key')).toEqual(null);
});

test('expired values are deleted before timeout and timeout is canceled', () => {
    const client = new Cache(1);

    Date.now = vi.fn(() => 0);
    client.set('key', 'value');

    Date.now = vi.fn(() => 500);
    expect(client.get('key')).toEqual('value');

    Date.now = vi.fn(() => 2000);
    expect(client.get('key')).toEqual(null);
});
