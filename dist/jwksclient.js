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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiandrc2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qd2tzY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBOEI7QUFFOUIsNERBQWtDO0FBQ2xDLDREQUErQztBQUMvQyxtQ0FBZ0M7QUFDaEMsc0RBQWlDO0FBUWpDLE1BQWEsVUFBVTtJQUtuQixZQUFZLE9BQWlCO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM3RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQztZQUNuQixTQUFTLEVBQUUsTUFBTTtZQUNqQixrQkFBa0IsRUFBRSxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUztTQUMzRSxDQUFDLENBQUM7SUFDUCxDQUFDO0lBS1ksUUFBUSxDQUFDLEdBQVcsRUFBRSxHQUFZOztZQUMzQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUMxQztZQUdELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtvQkFDckIsT0FBTyxXQUFXLENBQUM7aUJBQ3RCO2FBQ0o7WUFHRCxPQUFPLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBS2EsVUFBVSxDQUFDLEdBQVcsRUFBRSxHQUFZOztZQUM5QyxJQUFJLEdBQUcsR0FBUSxJQUFJLENBQUM7WUFDcEIsSUFBSTtnQkFDQSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNqRDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNsQztZQUVELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQ3ZDLE1BQU0sSUFBSSxnQkFBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEdBQUcscUJBQXFCLENBQUMsQ0FBQzthQUM3RDtZQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRTlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUMxQztZQUlELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV6QyxNQUFNLEdBQUcsR0FBRyxvQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTFCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2xDO1lBRUQsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQUE7SUFLTyxPQUFPLENBQUMsSUFBVyxFQUFFLEdBQVk7UUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtRQUdELElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7U0FDNUU7UUFFRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFdkMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLGFBQWEsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7U0FDdEU7UUFFRCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDO0NBQ0o7QUFsR0QsZ0NBa0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWdlbnQgfSBmcm9tICdodHRwcyc7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgandrVG9QZW0gZnJvbSAnandrLXRvLXBlbSc7XG5pbXBvcnQgZmV0Y2gsIHsgRmV0Y2hFcnJvciB9IGZyb20gJ25vZGUtZmV0Y2gnO1xuaW1wb3J0IHsgQ2FjaGUgfSBmcm9tICcuL2NhY2hlJztcbmltcG9ydCBIVFRQRXJyb3IgZnJvbSAnLi9lcnJvcnMnO1xuXG5pbnRlcmZhY2UgSU9wdGlvbnMge1xuICAgIGNhY2hlPzogYm9vbGVhbjtcbiAgICB0dGw/OiBudW1iZXI7XG4gICAgc3RyaWN0U1NMPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEpXS1NDbGllbnQge1xuICAgIHByaXZhdGUgY2FjaGU6IENhY2hlO1xuICAgIHByaXZhdGUgYWdlbnQ6IEFnZW50O1xuICAgIHByaXZhdGUgY2FjaGluZzogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IElPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY2FjaGluZyA9IG9wdGlvbnMuY2FjaGUgPT0gbnVsbCA/IGZhbHNlIDogb3B0aW9ucy5jYWNoZTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IG5ldyBDYWNoZShvcHRpb25zLnR0bCB8fCA2MCk7XG5cbiAgICAgICAgdGhpcy5hZ2VudCA9IG5ldyBBZ2VudCh7XG4gICAgICAgICAgICBlY2RoQ3VydmU6ICdhdXRvJyxcbiAgICAgICAgICAgIHJlamVjdFVuYXV0aG9yaXplZDogb3B0aW9ucy5zdHJpY3RTU0wgPT0gbnVsbCA/IHRydWUgOiBvcHRpb25zLnN0cmljdFNTTFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFB1YmxpYyBtZXRob2QgdG8gcmV0cmlldmUgYSBrZXkgZnJvbSBhIEpXS3NcbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgcmV0cmlldmUodXJsOiBzdHJpbmcsIGtpZD86IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgVVJMIGlzIG9ibGlnYXRvcnknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGNhY2hpbmcgd2FzIGVuYWJsZWQgdHJ5IHRvIHJldHJpZXZlIHRoZSBrZXkgZnJvbSB0aGUgY2FjaGVcbiAgICAgICAgaWYgKHRoaXMuY2FjaGluZykge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVkVmFsdWUgPSB0aGlzLmNhY2hlLmdldCh1cmwgKyBraWQpO1xuICAgICAgICAgICAgaWYgKGNhY2hlZFZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHRVQgdGhlIHJlbW90ZSBrZXlcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0RnJvbVVSTCh1cmwsIGtpZCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXRyaWV2ZSBhIGtleSBmcm9tIGEgcmVtb3RlIFVSTFxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgZ2V0RnJvbVVSTCh1cmw6IHN0cmluZywga2lkPzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgbGV0IHJlczogYW55ID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlcyA9IGF3YWl0IGZldGNoKHVybCwgeyBhZ2VudDogdGhpcy5hZ2VudCB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSFRUUEVycm9yKG51bGwsIGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzLnN0YXR1cyA8IDIwMCB8fCByZXMuc3RhdHVzID49IDMwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEhUVFBFcnJvcihyZXMsIGBVUkwgJHt1cmx9IGRpZCBub3QgcmV0dXJuIDJYWGApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgandrcyA9IGF3YWl0IHJlcy5qc29uKCk7XG5cbiAgICAgICAgaWYgKCFqd2tzLmtleXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBKV0tzIGZvcm1hdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZWFjaCBrZXkgU0hPVUxEIHVzZSBhIGRpc3RpbmN0IGtpZCwgYnV0IGlmIHR3byBrZXlzIHVzZSBkaXN0aW5jdCBrdHkvYWxnIHRoZSBzYW1lIGtpZCBjb3VsZCBiZSB1c2VkXG4gICAgICAgIC8vIGlmIG9ubHkgb25lIGtleSBpcyBwcmVzZW50IGtpZCBpcyBub3Qgb2JsaWdhdG9yeVxuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmZpbmRLZXkoandrcy5rZXlzLCBraWQpO1xuXG4gICAgICAgIGNvbnN0IHBlbSA9IGp3a1RvUGVtKGtleSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2FjaGluZykge1xuICAgICAgICAgICAgdGhpcy5jYWNoZS5zZXQodXJsICsga2lkLCBwZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBlbTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNlbGVjdCBhIGtleSBmcm9tIGEgbGlzdCBvZiBKV0tcbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbmRLZXkoa2V5czogYW55W10sIGtpZD86IHN0cmluZyk6IG9iamVjdCB7XG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbXB0eSBKV0tzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYgIWtpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGtleXNbMF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBubyBraWQgaXMgcHJlc2VudCBvbmx5IG9uZSBrZXkgbXVzdCBiZSBwcmVzZW50IGluc2lkZSB0aGUgSldLc1xuICAgICAgICBpZiAoIWtpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhIGtpZCBpcyByZXF1aXJlZCwgYXMgbW9yZSB0aGFuIG9uZSBKV0sgd2FzIHJldHJpZXZlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAga2V5cyA9IGtleXMuZmlsdGVyKGsgPT4gay5raWQgPT09IGtpZCk7XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGtleXMgbWF0Y2hpbmcga2lkICR7a2lkfSB3ZXJlIGZvdW5kYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1vcmUgdGhhbiBvbmUga2V5IHdpdGggc3BlY2lmaWVkIGtpZCB3ZXJlIGZvdW5kYCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5c1swXTtcbiAgICB9XG59XG4iXX0=