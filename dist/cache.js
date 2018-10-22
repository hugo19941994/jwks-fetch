"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Returns the current timestamp in UNIX time
 */
function ts() {
    return Math.round(Date.now() / 1000);
}
class Cache {
    constructor(ttl) {
        this.cache = {};
        this.ttl = ttl;
    }
    /*
     * Retrieves a value from the cache if it exists and has not expired
     */
    get(key) {
        if (!this.cache[key]) {
            return null;
        }
        else if (this.cache[key].exp < ts()) {
            // Edge case. The value has expired but it hasn't been removed.
            // Instead of returning a stale value cancel the timeout and
            // delete the entry manually
            clearTimeout(this.cache[key].timeout);
            delete this.cache[key];
            return null;
        }
        else {
            return this.cache[key].value;
        }
    }
    /*
     * Set a value in the cache with a given key
     */
    set(key, value) {
        this.cache[key] = { exp: ts() + this.ttl, value };
        this.cache[key].timeout = setTimeout(() => {
            delete this.cache[key];
        }, this.ttl);
    }
}
exports.Cache = Cache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILFNBQVMsRUFBRTtJQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVELE1BQWEsS0FBSztJQUlkLFlBQVksR0FBVztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQ7O09BRUc7SUFDSSxHQUFHLENBQUMsR0FBVztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQixPQUFPLElBQUksQ0FBQztTQUNmO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsRUFBRTtZQUNuQywrREFBK0Q7WUFDL0QsNERBQTREO1lBQzVELDRCQUE0QjtZQUM1QixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNoQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBYTtRQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUN0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDO0NBQ0o7QUFwQ0Qsc0JBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGluIFVOSVggdGltZVxuICovXG5mdW5jdGlvbiB0cygpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKERhdGUubm93KCkgLyAxMDAwKTtcbn1cblxuZXhwb3J0IGNsYXNzIENhY2hlIHtcbiAgICBwdWJsaWMgY2FjaGU6IGFueTtcbiAgICBwdWJsaWMgdHRsOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcih0dGw6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNhY2hlID0ge307XG4gICAgICAgIHRoaXMudHRsID0gdHRsO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgY2FjaGUgaWYgaXQgZXhpc3RzIGFuZCBoYXMgbm90IGV4cGlyZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0KGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIGlmICghdGhpcy5jYWNoZVtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNhY2hlW2tleV0uZXhwIDwgdHMoKSkge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlLiBUaGUgdmFsdWUgaGFzIGV4cGlyZWQgYnV0IGl0IGhhc24ndCBiZWVuIHJlbW92ZWQuXG4gICAgICAgICAgICAvLyBJbnN0ZWFkIG9mIHJldHVybmluZyBhIHN0YWxlIHZhbHVlIGNhbmNlbCB0aGUgdGltZW91dCBhbmRcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgZW50cnkgbWFudWFsbHlcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNhY2hlW2tleV0udGltZW91dCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldLnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTZXQgYSB2YWx1ZSBpbiB0aGUgY2FjaGUgd2l0aCBhIGdpdmVuIGtleVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldID0geyBleHA6IHRzKCkgKyB0aGlzLnR0bCwgdmFsdWUgfTtcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNhY2hlW2tleV07XG4gICAgICAgIH0sIHRoaXMudHRsKTtcbiAgICB9XG59XG4iXX0=