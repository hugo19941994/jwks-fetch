/*
 * Returns the current timestamp in UNIX time
 */
function ts(): number {
  return Math.round(Date.now() / 1000);
}

export class Cache {
  public cache: Record<
    string,
    { exp: number; value: string; timeout?: NodeJS.Timeout }
  >;
  public ttl: number;

  constructor(ttl: number) {
    this.cache = {};
    this.ttl = ttl;
  }

  /*
   * Retrieves a value from the cache if it exists and has not expired
   */
  public get(key: string): string | null {
    if (!this.cache[key]) {
      return null;
    } else if (this.cache[key].exp < ts()) {
      // Edge case. The value has expired but it hasn't been removed.
      // Instead of returning a stale value cancel the timeout and
      // delete the entry manually
      clearTimeout(this.cache[key].timeout);
      delete this.cache[key];
      return null;
    } else {
      return this.cache[key].value;
    }
  }

  /*
   * Set a value in the cache with a given key
   */
  public set(key: string, value: string): void {
    this.cache[key] = { exp: ts() + this.ttl, value };
    this.cache[key].timeout = setTimeout(() => {
      delete this.cache[key];
    }, this.ttl);
  }
}
