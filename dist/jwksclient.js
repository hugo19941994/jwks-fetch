"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
// @ts-ignore
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const cache_1 = require("./cache");
const errors_1 = __importDefault(require("./errors"));
class JWKSClient {
    constructor(options) {
        this.caching = options.cache == null ? false : options.cache;
        this.cache = new cache_1.Cache(options.ttl || 60);
        this.agent = new https_1.Agent({ rejectUnauthorized: options.strictSSL == null ? true : options.strictSSL });
    }
    /*
     * Public method to retrieve a key from a JWKs
     */
    retrieve(url, kid) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield this.getFromURL(url, kid);
        });
    }
    /*
     * Retrieve a key from a remote URL
     */
    getFromURL(url, kid) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield node_fetch_1.default(url, { agent: this.agent });
            if (res.status < 200 || res.status >= 300) {
                throw new errors_1.default(res, `URL ${url} did not return 2XX`);
            }
            const jwks = yield res.json();
            if (!jwks.keys) {
                throw new Error('Invalid JWKs format');
            }
            // each key SHOULD use a distinct kid, but if two keys use distinct kty/alg the same kid could be used
            // if only one key is present kid is not obligatory
            const key = this.findKey(jwks.keys, kid);
            const pem = jwk_to_pem_1.default(key);
            if (this.caching) {
                this.cache.set(url + kid, pem);
            }
            return pem;
        });
    }
    /*
     * Select a key from a list of JWK
     */
    findKey(keys, kid) {
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
exports.JWKSClient = JWKSClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiandrc2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qd2tzY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBOEI7QUFDOUIsYUFBYTtBQUNiLDREQUFrQztBQUNsQyw0REFBK0M7QUFDL0MsbUNBQWdDO0FBQ2hDLHNEQUFpQztBQVFqQyxNQUFhLFVBQVU7SUFLbkIsWUFBWSxPQUFpQjtRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUN6RyxDQUFDO0lBRUQ7O09BRUc7SUFDVSxRQUFRLENBQUMsR0FBVyxFQUFFLEdBQVk7O1lBQzNDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzFDO1lBRUQsZ0VBQWdFO1lBQ2hFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtvQkFDckIsT0FBTyxXQUFXLENBQUM7aUJBQ3RCO2FBQ0o7WUFFRCxxQkFBcUI7WUFDckIsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1csVUFBVSxDQUFDLEdBQVcsRUFBRSxHQUFZOztZQUM5QyxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRXBELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQ3ZDLE1BQU0sSUFBSSxnQkFBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEdBQUcscUJBQXFCLENBQUMsQ0FBQzthQUM3RDtZQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRTlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUMxQztZQUVELHNHQUFzRztZQUN0RyxtREFBbUQ7WUFDbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLE1BQU0sR0FBRyxHQUFHLG9CQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFMUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0ssT0FBTyxDQUFDLElBQVcsRUFBRSxHQUFZO1FBQ3JDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFFRCxvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUM1RTtRQUVELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUV2QyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsYUFBYSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUN0RTtRQUVELE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7Q0FDSjtBQTFGRCxnQ0EwRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZ2VudCB9IGZyb20gJ2h0dHBzJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBqd2tUb1BlbSBmcm9tICdqd2stdG8tcGVtJztcbmltcG9ydCBmZXRjaCwgeyBGZXRjaEVycm9yIH0gZnJvbSAnbm9kZS1mZXRjaCc7XG5pbXBvcnQgeyBDYWNoZSB9IGZyb20gJy4vY2FjaGUnO1xuaW1wb3J0IEhUVFBFcnJvciBmcm9tICcuL2Vycm9ycyc7XG5cbmludGVyZmFjZSBJT3B0aW9ucyB7XG4gICAgY2FjaGU/OiBib29sZWFuO1xuICAgIHR0bD86IG51bWJlcjtcbiAgICBzdHJpY3RTU0w/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSldLU0NsaWVudCB7XG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGU7XG4gICAgcHJpdmF0ZSBhZ2VudDogQWdlbnQ7XG4gICAgcHJpdmF0ZSBjYWNoaW5nOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogSU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jYWNoaW5nID0gb3B0aW9ucy5jYWNoZSA9PSBudWxsID8gZmFsc2UgOiBvcHRpb25zLmNhY2hlO1xuICAgICAgICB0aGlzLmNhY2hlID0gbmV3IENhY2hlKG9wdGlvbnMudHRsIHx8IDYwKTtcblxuICAgICAgICB0aGlzLmFnZW50ID0gbmV3IEFnZW50KHsgcmVqZWN0VW5hdXRob3JpemVkOiBvcHRpb25zLnN0cmljdFNTTCA9PSBudWxsID8gdHJ1ZSA6IG9wdGlvbnMuc3RyaWN0U1NMIH0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUHVibGljIG1ldGhvZCB0byByZXRyaWV2ZSBhIGtleSBmcm9tIGEgSldLc1xuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyByZXRyaWV2ZSh1cmw6IHN0cmluZywga2lkPzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSBVUkwgaXMgb2JsaWdhdG9yeScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgY2FjaGluZyB3YXMgZW5hYmxlZCB0cnkgdG8gcmV0cmlldmUgdGhlIGtleSBmcm9tIHRoZSBjYWNoZVxuICAgICAgICBpZiAodGhpcy5jYWNoaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWRWYWx1ZSA9IHRoaXMuY2FjaGUuZ2V0KHVybCArIGtpZCk7XG4gICAgICAgICAgICBpZiAoY2FjaGVkVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdFVCB0aGUgcmVtb3RlIGtleVxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRGcm9tVVJMKHVybCwga2lkKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHJpZXZlIGEga2V5IGZyb20gYSByZW1vdGUgVVJMXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRGcm9tVVJMKHVybDogc3RyaW5nLCBraWQ/OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHsgYWdlbnQ6IHRoaXMuYWdlbnQgfSk7XG5cbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+PSAzMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIVFRQRXJyb3IocmVzLCBgVVJMICR7dXJsfSBkaWQgbm90IHJldHVybiAyWFhgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGp3a3MgPSBhd2FpdCByZXMuanNvbigpO1xuXG4gICAgICAgIGlmICghandrcy5rZXlzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSldLcyBmb3JtYXQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVhY2gga2V5IFNIT1VMRCB1c2UgYSBkaXN0aW5jdCBraWQsIGJ1dCBpZiB0d28ga2V5cyB1c2UgZGlzdGluY3Qga3R5L2FsZyB0aGUgc2FtZSBraWQgY291bGQgYmUgdXNlZFxuICAgICAgICAvLyBpZiBvbmx5IG9uZSBrZXkgaXMgcHJlc2VudCBraWQgaXMgbm90IG9ibGlnYXRvcnlcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5maW5kS2V5KGp3a3Mua2V5cywga2lkKTtcblxuICAgICAgICBjb25zdCBwZW0gPSBqd2tUb1BlbShrZXkpO1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuc2V0KHVybCArIGtpZCwgcGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwZW07XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTZWxlY3QgYSBrZXkgZnJvbSBhIGxpc3Qgb2YgSldLXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaW5kS2V5KGtleXM6IGFueVtdLCBraWQ/OiBzdHJpbmcpOiBvYmplY3Qge1xuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW1wdHkgSldLcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmICFraWQpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8ga2lkIGlzIHByZXNlbnQgb25seSBvbmUga2V5IG11c3QgYmUgcHJlc2VudCBpbnNpZGUgdGhlIEpXS3NcbiAgICAgICAgaWYgKCFraWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYSBraWQgaXMgcmVxdWlyZWQsIGFzIG1vcmUgdGhhbiBvbmUgSldLIHdhcyByZXRyaWV2ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleXMgPSBrZXlzLmZpbHRlcihrID0+IGsua2lkID09PSBraWQpO1xuXG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBrZXlzIG1hdGNoaW5nIGtpZCAke2tpZH0gd2VyZSBmb3VuZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNb3JlIHRoYW4gb25lIGtleSB3aXRoIHNwZWNpZmllZCBraWQgd2VyZSBmb3VuZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXNbMF07XG4gICAgfVxufVxuIl19