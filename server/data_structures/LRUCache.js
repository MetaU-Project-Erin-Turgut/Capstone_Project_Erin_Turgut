const { DoublyLinkedList } = require("./DoublyLinkedList");

//cache structure with Map and DLL. 
class LRUCache {
    constructor(maxCacheSize) {
        this.DLL = new DoublyLinkedList()
        this.HashMap = new Map();
        this.MAX_CACHE_SIZE = maxCacheSize
    }

    checkIsFull() {
        return this.DLL.getLength() === this.MAX_CACHE_SIZE
    }

    addEntry(newKey, newValue, ttl) {
        if(this.checkIsFull()) {
            const removedNode = this.DLL.removeEnd(); //if full remove least recently used node
            this.HashMap.delete(removedNode.key);
        }

        const addedNode = this.DLL.insertBeginning(newKey, newValue); //insert at beginning because most recently used
        this.HashMap.set(addedNode.key, {results: addedNode, ttl: ttl})
    }

    getEntry(queriedKey) {
        if(this.HashMap.has(queriedKey)) {
            //if already in cache, also make head of DLL because it is now the most recent query
            //moveBeginning return new node, so replace in map as well

            const currResults = this.HashMap.get(queriedKey).results;
            const currTTL = this.HashMap.get(queriedKey).ttl;
            this.HashMap.delete(queriedKey); //need to delete before setting again so that order of recent queries is not only maintained in DLL but also the Map
            this.HashMap.set(queriedKey, {results: this.DLL.moveBeginning(currResults), ttl: currTTL})
            return this.HashMap.get(queriedKey);
        }
        return null;
    }

    deleteBeginning(queriedKey) {
        this.DLL.deleteBeginning(this.HashMap.get(queriedKey).results)
        this.HashMap.delete(queriedKey);
    }

    //for debugging
    printCache(message) {
        console.log(message)
        console.log("DLL: ",this.DLL.getList())
        console.log("Map: ",this.HashMap)
    }
}

module.exports = {LRUCache};