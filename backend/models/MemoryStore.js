class MemoryStore {
    constructor() {
        this.store = new Map();
    }

    // Save a value with an optional TTL (Time-To-Live)
    set(key, value, ttl = null) {
        const record = { value, expires: ttl ? Date.now() + ttl : null };
        this.store.set(key, record);
    }

    // Get the value if not expired; otherwise, return null
    get(key) {
        const record = this.store.get(key);
        if (!record) return null;
        if (record.expires && Date.now() > record.expires) {
            this.store.delete(key);
            return null;
        }
        return record.value;
    }

    // Delete a key
    delete(key) {
        this.store.delete(key);
    }

    // Check whether a key exists and is not expired
    has(key) {
        const record = this.store.get(key);
        if (!record) return false;
        if (record.expires && Date.now() > record.expires) {
            this.store.delete(key);
            return false;
        }
        return true;
    }
}

module.exports = MemoryStore;