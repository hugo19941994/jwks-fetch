import { Request } from 'node-fetch';

export default class HTTPError extends Error {
    public res: Request | null;
    public status: number | null;

    constructor(req?: any, ...params: any) {
        super(...params);

        this.res = req ? req : null;
        this.status = req ? req.status : null;

        Error.captureStackTrace(this, HTTPError);
    }
}
