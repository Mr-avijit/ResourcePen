/**
 * DATA ACCELERATION LAYER
 * Simulates high-performance in-memory caching.
 */
class CacheStore {
  constructor() {
    this.store = new Map();
  }

  set(key, val, ttl = 3600) {
    this.store.set(key, { val, expiry: Date.now() + (ttl * 1000) });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.val;
  }
}

module.exports = new CacheStore();