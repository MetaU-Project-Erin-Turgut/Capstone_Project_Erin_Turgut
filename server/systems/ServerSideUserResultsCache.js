const { LRUCache } = require("../data_structures/LRUCache");

const MAX_LOWER_LEVEL_CACHE_SIZE = 100;
const MAX_UPPER_LEVEL_CACHE_SIZE = 50;

class ServerSideCache {
    //this will be a leveled cache 
    //lower level (i.e globalUserCache) will have general keyword and user search results
    //upper level (i.e userSpecificCache) will have user search results sorted by closest user relation with user-specific keys
    constructor() {
        this.globalUserCache = new LRUCache(MAX_LOWER_LEVEL_CACHE_SIZE); 
        this.userSpecificCache = new LRUCache(MAX_UPPER_LEVEL_CACHE_SIZE);
    }

    checkUserSpecificCache(queriedKey) {
        return this.userSpecificCache.getEntry(queriedKey);
    }

    checkGlobalUserCache(queriedKey) {
        return this.globalUserCache.getEntry(queriedKey);
    }

    insertUserSpecificCache(newKey, newValue) {
        this.userSpecificCache.addEntry(newKey, newValue);
    }

    insertGlobalUserCache(newKey, newValue) {
        this.globalUserCache.addEntry(newKey, newValue);
    }

    //for debugging
    printCaches() {
        this.globalUserCache.printCache("Global cache: ");
        this.userSpecificCache.printCache("User specific cache: ");
    }
}

module.exports = {ServerSideCache}