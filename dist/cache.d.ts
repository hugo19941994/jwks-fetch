export declare class Cache {
    cache: any;
    ttl: number;
    constructor(ttl: number);
    get(key: string): string | null;
    set(key: string, value: string): void;
}
