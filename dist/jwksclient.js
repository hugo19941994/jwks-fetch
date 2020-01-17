"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
        this.agent = new https_1.Agent({
            ecdhCurve: 'auto',
            rejectUnauthorized: options.strictSSL == null ? true : options.strictSSL
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiandrc2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qd2tzY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQThCO0FBRTlCLDREQUFrQztBQUNsQyw0REFBK0M7QUFDL0MsbUNBQWdDO0FBQ2hDLHNEQUFpQztBQVFqQyxNQUFhLFVBQVU7SUFLbkIsWUFBWSxPQUFpQjtRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUM7WUFDbkIsU0FBUyxFQUFFLE1BQU07WUFDakIsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVM7U0FDM0UsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUtZLFFBQVEsQ0FBQyxHQUFXLEVBQUUsR0FBWTs7WUFDM0MsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDTixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDMUM7WUFHRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUU7b0JBQ3JCLE9BQU8sV0FBVyxDQUFDO2lCQUN0QjthQUNKO1lBR0QsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLENBQUM7S0FBQTtJQUthLFVBQVUsQ0FBQyxHQUFXLEVBQUUsR0FBWTs7WUFDOUMsSUFBSSxHQUFHLEdBQVEsSUFBSSxDQUFDO1lBQ3BCLElBQUk7Z0JBQ0EsR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDakQ7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixNQUFNLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFFRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO2dCQUN2QyxNQUFNLElBQUksZ0JBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxHQUFHLHFCQUFxQixDQUFDLENBQUM7YUFDN0Q7WUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDMUM7WUFJRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFekMsTUFBTSxHQUFHLEdBQUcsb0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUxQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNsQztZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBS08sT0FBTyxDQUFDLElBQVcsRUFBRSxHQUFZO1FBQ3JDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFHRCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1NBQzVFO1FBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxhQUFhLENBQUMsQ0FBQztTQUM3RDtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsQ0FBQztDQUNKO0FBbEdELGdDQWtHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFnZW50IH0gZnJvbSAnaHR0cHMnO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IGp3a1RvUGVtIGZyb20gJ2p3ay10by1wZW0nO1xuaW1wb3J0IGZldGNoLCB7IEZldGNoRXJyb3IgfSBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCB7IENhY2hlIH0gZnJvbSAnLi9jYWNoZSc7XG5pbXBvcnQgSFRUUEVycm9yIGZyb20gJy4vZXJyb3JzJztcblxuaW50ZXJmYWNlIElPcHRpb25zIHtcbiAgICBjYWNoZT86IGJvb2xlYW47XG4gICAgdHRsPzogbnVtYmVyO1xuICAgIHN0cmljdFNTTD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBKV0tTQ2xpZW50IHtcbiAgICBwcml2YXRlIGNhY2hlOiBDYWNoZTtcbiAgICBwcml2YXRlIGFnZW50OiBBZ2VudDtcbiAgICBwcml2YXRlIGNhY2hpbmc6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBJT3B0aW9ucykge1xuICAgICAgICB0aGlzLmNhY2hpbmcgPSBvcHRpb25zLmNhY2hlID09IG51bGwgPyBmYWxzZSA6IG9wdGlvbnMuY2FjaGU7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBuZXcgQ2FjaGUob3B0aW9ucy50dGwgfHwgNjApO1xuXG4gICAgICAgIHRoaXMuYWdlbnQgPSBuZXcgQWdlbnQoe1xuICAgICAgICAgICAgZWNkaEN1cnZlOiAnYXV0bycsXG4gICAgICAgICAgICByZWplY3RVbmF1dGhvcml6ZWQ6IG9wdGlvbnMuc3RyaWN0U1NMID09IG51bGwgPyB0cnVlIDogb3B0aW9ucy5zdHJpY3RTU0xcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQdWJsaWMgbWV0aG9kIHRvIHJldHJpZXZlIGEga2V5IGZyb20gYSBKV0tzXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIHJldHJpZXZlKHVybDogc3RyaW5nLCBraWQ/OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBpZiAoIXVybCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIFVSTCBpcyBvYmxpZ2F0b3J5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBjYWNoaW5nIHdhcyBlbmFibGVkIHRyeSB0byByZXRyaWV2ZSB0aGUga2V5IGZyb20gdGhlIGNhY2hlXG4gICAgICAgIGlmICh0aGlzLmNhY2hpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZFZhbHVlID0gdGhpcy5jYWNoZS5nZXQodXJsICsga2lkKTtcbiAgICAgICAgICAgIGlmIChjYWNoZWRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR0VUIHRoZSByZW1vdGUga2V5XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldEZyb21VUkwodXJsLCBraWQpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0cmlldmUgYSBrZXkgZnJvbSBhIHJlbW90ZSBVUkxcbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIGdldEZyb21VUkwodXJsOiBzdHJpbmcsIGtpZD86IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGxldCByZXM6IGFueSA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIHsgYWdlbnQ6IHRoaXMuYWdlbnQgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEhUVFBFcnJvcihudWxsLCBlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+PSAzMDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBIVFRQRXJyb3IocmVzLCBgVVJMICR7dXJsfSBkaWQgbm90IHJldHVybiAyWFhgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGp3a3MgPSBhd2FpdCByZXMuanNvbigpO1xuXG4gICAgICAgIGlmICghandrcy5rZXlzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSldLcyBmb3JtYXQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVhY2gga2V5IFNIT1VMRCB1c2UgYSBkaXN0aW5jdCBraWQsIGJ1dCBpZiB0d28ga2V5cyB1c2UgZGlzdGluY3Qga3R5L2FsZyB0aGUgc2FtZSBraWQgY291bGQgYmUgdXNlZFxuICAgICAgICAvLyBpZiBvbmx5IG9uZSBrZXkgaXMgcHJlc2VudCBraWQgaXMgbm90IG9ibGlnYXRvcnlcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5maW5kS2V5KGp3a3Mua2V5cywga2lkKTtcblxuICAgICAgICBjb25zdCBwZW0gPSBqd2tUb1BlbShrZXkpO1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuc2V0KHVybCArIGtpZCwgcGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwZW07XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTZWxlY3QgYSBrZXkgZnJvbSBhIGxpc3Qgb2YgSldLXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaW5kS2V5KGtleXM6IGFueVtdLCBraWQ/OiBzdHJpbmcpOiBvYmplY3Qge1xuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRW1wdHkgSldLcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmICFraWQpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8ga2lkIGlzIHByZXNlbnQgb25seSBvbmUga2V5IG11c3QgYmUgcHJlc2VudCBpbnNpZGUgdGhlIEpXS3NcbiAgICAgICAgaWYgKCFraWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYSBraWQgaXMgcmVxdWlyZWQsIGFzIG1vcmUgdGhhbiBvbmUgSldLIHdhcyByZXRyaWV2ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleXMgPSBrZXlzLmZpbHRlcihrID0+IGsua2lkID09PSBraWQpO1xuXG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBrZXlzIG1hdGNoaW5nIGtpZCAke2tpZH0gd2VyZSBmb3VuZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNb3JlIHRoYW4gb25lIGtleSB3aXRoIHNwZWNpZmllZCBraWQgd2VyZSBmb3VuZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXNbMF07XG4gICAgfVxufVxuIl19