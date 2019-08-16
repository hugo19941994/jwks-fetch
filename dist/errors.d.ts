import { Request } from 'node-fetch';
export default class HTTPError extends Error {
    res: Request | null;
    status: number | null;
    constructor(req?: any, ...params: any);
}
