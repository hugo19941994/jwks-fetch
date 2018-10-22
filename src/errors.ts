import { Request } from 'node-fetch';

export default class HTTPError extends Error {
    public res: Request;
    public status: number;

    constructor(req: any, ...params: any) {
        super(...params);

        this.res = req;
        this.status = req.status;

        Error.captureStackTrace(this, HTTPError);
    }
}
