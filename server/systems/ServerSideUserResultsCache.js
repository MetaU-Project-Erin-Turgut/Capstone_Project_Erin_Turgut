const { LRUCache } = require("../data_structures/LRUCache");

const MAX_LOWER_LEVEL_CACHE_SIZE = 100;
const MAX_UPPER_LEVEL_CACHE_SIZE = 50;

const TTL_FOR_HL_CACHE = 3600000; //1 hour in milliseconds
const TTL_FOR_LL_CACHE = 7200000; //2 hours in milliseconds

class ServerSideCache {
    //this will be a leveled cache 
    //lower level (i.e globalUserCache) will have general keyword and user search results
    //upper level (i.e userSpecificCache) will have user search results sorted by closest user relation with user-specific keys
    constructor() {
        this.globalUserCache = new LRUCache(MAX_LOWER_LEVEL_CACHE_SIZE); 
        this.userSpecificCache = new LRUCache(MAX_UPPER_LEVEL_CACHE_SIZE);
    }

    checkUserSpecificCache(queriedKey, userId) {
        const retrievedEntry = this.userSpecificCache.getEntry(userId + queriedKey);
        //NOTE: getEntry moves the queried node to the beginning of the DLL, regardless of if it's expired or not. 
        //therefore, if it's expired, we just delete first node.
        if (retrievedEntry && retrievedEntry.ttl < Date.now()) { //means this entry is expired
            this.deleteBeginningUserSpecificCache(userId + queriedKey);
            return null;
        }
        if (!retrievedEntry) return null;
        return retrievedEntry.results.value;
    }

    checkGlobalUserCache(queriedKey) {
        const retrievedEntry = this.globalUserCache.getEntry(queriedKey);
        if (retrievedEntry && retrievedEntry.ttl < Date.now()) { //means this entry is expired
            this.deleteBeginningGlobalUserCache(queriedKey);
            return null;
        }
        if (!retrievedEntry) return null;
        return retrievedEntry.results.value;
    }

    deleteBeginningUserSpecificCache(queriedKey) {
        this.userSpecificCache.deleteBeginning(queriedKey);
    }

    deleteBeginningGlobalUserCache(queriedKey) {
        this.globalUserCache.deleteBeginning(queriedKey);
    }

    insertUserSpecificCache(newKey, newValue, userId) { 
        //newValue holds the user results
        this.userSpecificCache.addEntry(userId + newKey, newValue, Date.now() + TTL_FOR_HL_CACHE);
    }

    insertGlobalUserCache(newKey, newValue) {
        //newValue holds the user results
        this.globalUserCache.addEntry(newKey, newValue, Date.now() + TTL_FOR_LL_CACHE);
    }

    getUserSpecificCacheByUserId(userId) {
        const userSpecificEntries = Array.from(this.userSpecificCache.HashMap.entries()).filter((entry) => {
            return entry[0].toString().charAt(0) == userId;
        })
        return userSpecificEntries;
    }

    //for debugging
    printCaches() {
        this.globalUserCache.printCache("Global cache: ");
        this.userSpecificCache.printCache("User specific cache: ");
    }
}

module.exports = {ServerSideCache}