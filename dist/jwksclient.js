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
    retrieve(url, kid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                throw new Error('A URL is obligatory');
            }
            if (this.caching) {
                const cachedValue = this.cache.get(url + kid);
                if (cachedValue != null) {
                    return cachedValue;
                }
            }
            return yield this.getFromURL(url, kid);
        });
    }
    getFromURL(url, kid) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            try {
                res = yield node_fetch_1.default(url, { agent: this.agent });
            }
            catch (err) {
                throw new errors_1.default(null, err);
            }
            if (res.status < 200 || res.status >= 300) {
                throw new errors_1.default(res, `URL ${url} did not return 2XX`);
            }
            const jwks = yield res.json();
            if (!jwks.keys) {
                throw new Error('Invalid JWKs format');
            }
            const key = this.findKey(jwks.keys, kid);
            const pem = jwk_to_pem_1.default(key);
            if (this.caching) {
                this.cache.set(url + kid, pem);
            }
            return pem;
        });
    }
    findKey(keys, kid) {
        if (keys.length === 0) {
            throw new Error('Empty JWKs');
        }
        if (keys.length === 1 && !kid) {
            return keys[0];
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiandrc2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qd2tzY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBOEI7QUFFOUIsNERBQWtDO0FBQ2xDLDREQUErQztBQUMvQyxtQ0FBZ0M7QUFDaEMsc0RBQWlDO0FBUWpDLE1BQWEsVUFBVTtJQUtuQixZQUFZLE9BQWlCO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM3RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxFQUFFLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFLWSxRQUFRLENBQUMsR0FBVyxFQUFFLEdBQVk7O1lBQzNDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzFDO1lBR0QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNkLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO29CQUNyQixPQUFPLFdBQVcsQ0FBQztpQkFDdEI7YUFDSjtZQUdELE9BQU8sTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFLYSxVQUFVLENBQUMsR0FBVyxFQUFFLEdBQVk7O1lBQzlDLElBQUksR0FBRyxHQUFRLElBQUksQ0FBQztZQUNwQixJQUFJO2dCQUNBLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQ2pEO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2xDO1lBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtnQkFDdkMsTUFBTSxJQUFJLGdCQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzdEO1lBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzFDO1lBSUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLE1BQU0sR0FBRyxHQUFHLG9CQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFMUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtJQUtPLE9BQU8sQ0FBQyxJQUFXLEVBQUUsR0FBWTtRQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO1FBR0QsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUM1RTtRQUVELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUV2QyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsYUFBYSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUN0RTtRQUVELE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7Q0FDSjtBQS9GRCxnQ0ErRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZ2VudCB9IGZyb20gJ2h0dHBzJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBqd2tUb1BlbSBmcm9tICdqd2stdG8tcGVtJztcbmltcG9ydCBmZXRjaCwgeyBGZXRjaEVycm9yIH0gZnJvbSAnbm9kZS1mZXRjaCc7XG5pbXBvcnQgeyBDYWNoZSB9IGZyb20gJy4vY2FjaGUnO1xuaW1wb3J0IEhUVFBFcnJvciBmcm9tICcuL2Vycm9ycyc7XG5cbmludGVyZmFjZSBJT3B0aW9ucyB7XG4gICAgY2FjaGU/OiBib29sZWFuO1xuICAgIHR0bD86IG51bWJlcjtcbiAgICBzdHJpY3RTU0w/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSldLU0NsaWVudCB7XG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGU7XG4gICAgcHJpdmF0ZSBhZ2VudDogQWdlbnQ7XG4gICAgcHJpdmF0ZSBjYWNoaW5nOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogSU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jYWNoaW5nID0gb3B0aW9ucy5jYWNoZSA9PSBudWxsID8gZmFsc2UgOiBvcHRpb25zLmNhY2hlO1xuICAgICAgICB0aGlzLmNhY2hlID0gbmV3IENhY2hlKG9wdGlvbnMudHRsIHx8IDYwKTtcblxuICAgICAgICB0aGlzLmFnZW50ID0gbmV3IEFnZW50KHsgcmVqZWN0VW5hdXRob3JpemVkOiBvcHRpb25zLnN0cmljdFNTTCA9PSBudWxsID8gdHJ1ZSA6IG9wdGlvbnMuc3RyaWN0U1NMIH0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUHVibGljIG1ldGhvZCB0byByZXRyaWV2ZSBhIGtleSBmcm9tIGEgSldLc1xuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyByZXRyaWV2ZSh1cmw6IHN0cmluZywga2lkPzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSBVUkwgaXMgb2JsaWdhdG9yeScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgY2FjaGluZyB3YXMgZW5hYmxlZCB0cnkgdG8gcmV0cmlldmUgdGhlIGtleSBmcm9tIHRoZSBjYWNoZVxuICAgICAgICBpZiAodGhpcy5jYWNoaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWRWYWx1ZSA9IHRoaXMuY2FjaGUuZ2V0KHVybCArIGtpZCk7XG4gICAgICAgICAgICBpZiAoY2FjaGVkVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdFVCB0aGUgcmVtb3RlIGtleVxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRGcm9tVVJMKHVybCwga2lkKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHJpZXZlIGEga2V5IGZyb20gYSByZW1vdGUgVVJMXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRGcm9tVVJMKHVybDogc3RyaW5nLCBraWQ/OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBsZXQgcmVzOiBhbnkgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzID0gYXdhaXQgZmV0Y2godXJsLCB7IGFnZW50OiB0aGlzLmFnZW50IH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIVFRQRXJyb3IobnVsbCwgZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXMuc3RhdHVzIDwgMjAwIHx8IHJlcy5zdGF0dXMgPj0gMzAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSFRUUEVycm9yKHJlcywgYFVSTCAke3VybH0gZGlkIG5vdCByZXR1cm4gMlhYYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBqd2tzID0gYXdhaXQgcmVzLmpzb24oKTtcblxuICAgICAgICBpZiAoIWp3a3Mua2V5cykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEpXS3MgZm9ybWF0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlYWNoIGtleSBTSE9VTEQgdXNlIGEgZGlzdGluY3Qga2lkLCBidXQgaWYgdHdvIGtleXMgdXNlIGRpc3RpbmN0IGt0eS9hbGcgdGhlIHNhbWUga2lkIGNvdWxkIGJlIHVzZWRcbiAgICAgICAgLy8gaWYgb25seSBvbmUga2V5IGlzIHByZXNlbnQga2lkIGlzIG5vdCBvYmxpZ2F0b3J5XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuZmluZEtleShqd2tzLmtleXMsIGtpZCk7XG5cbiAgICAgICAgY29uc3QgcGVtID0gandrVG9QZW0oa2V5KTtcblxuICAgICAgICBpZiAodGhpcy5jYWNoaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlLnNldCh1cmwgKyBraWQsIHBlbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGVtO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogU2VsZWN0IGEga2V5IGZyb20gYSBsaXN0IG9mIEpXS1xuICAgICAqL1xuICAgIHByaXZhdGUgZmluZEtleShrZXlzOiBhbnlbXSwga2lkPzogc3RyaW5nKTogb2JqZWN0IHtcbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtcHR5IEpXS3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiAha2lkKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIGtpZCBpcyBwcmVzZW50IG9ubHkgb25lIGtleSBtdXN0IGJlIHByZXNlbnQgaW5zaWRlIHRoZSBKV0tzXG4gICAgICAgIGlmICgha2lkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Ega2lkIGlzIHJlcXVpcmVkLCBhcyBtb3JlIHRoYW4gb25lIEpXSyB3YXMgcmV0cmlldmVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBrZXlzID0ga2V5cy5maWx0ZXIoayA9PiBrLmtpZCA9PT0ga2lkKTtcblxuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8ga2V5cyBtYXRjaGluZyBraWQgJHtraWR9IHdlcmUgZm91bmRgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTW9yZSB0aGFuIG9uZSBrZXkgd2l0aCBzcGVjaWZpZWQga2lkIHdlcmUgZm91bmRgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzWzBdO1xuICAgIH1cbn1cbiJdfQ==