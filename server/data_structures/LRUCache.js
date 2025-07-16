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

    addEntry(newKey, newValue) {
        if(this.checkIsFull()) {
            const removedNode = this.DLL.removeEnd(); //if full remove least recently used node
            this.HashMap.delete(removedNode.key);
        }

        const addedNode = this.DLL.insertBeginning(newKey, newValue); //insert at beginning because most recently used
        this.HashMap.set(addedNode.key, addedNode)
    }

    getEntry(queriedKey) {
        if(this.HashMap.has(queriedKey)) {
            //if already in cache, also make head of DLL because it is now the most recent query
            //moveBeginning return new node, so replace in map as well

            const currValue = this.HashMap.get(queriedKey)
            this.HashMap.delete(queriedKey); //need to delete before setting again so that order of recent queries is not only maintained in DLL but also the Map
            this.HashMap.set(queriedKey, this.DLL.moveBeginning(currValue))
            return this.HashMap.get(queriedKey).value;
        }
        return null;
    }

    //for debugging
    printCache(message) {
        console.log(message)
        console.log("DLL: ",this.DLL.getList())
        console.log("Map: ",this.HashMap)
    }
}

module.exports = {LRUCache};