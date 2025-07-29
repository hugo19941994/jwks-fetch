import type { Response } from "undici";

export default class HTTPError extends Error {
  public res: Response | null;
  public status: number | null;

  constructor(res?: Response | null, message?: string) {
    super(message);

    this.name = "HTTPError";
    this.res = res ? res : null;
    this.status = res ? res.status : null;

    Error.captureStackTrace(this, HTTPError);
  }
}
