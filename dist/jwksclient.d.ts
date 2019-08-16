interface IOptions {
    cache?: boolean;
    ttl?: number;
    strictSSL?: boolean;
}
export declare class JWKSClient {
    private cache;
    private agent;
    private caching;
    constructor(options: IOptions);
    retrieve(url: string, kid?: string): Promise<string>;
    private getFromURL;
    private findKey;
}
export {};
