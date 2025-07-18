class DoublyLinkedList {

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    getLength() {
        return this.length;
    }
    
    //beginning(head) will be considered most recent
    insertBeginning(key, value) {
        const newNode = new Node(key, value);
        if (this.length === 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.head;
            this.head.next = newNode;
            this.head = newNode;
        }
        this.length++;

        return newNode;
    }

    moveBeginning(node) {

        const tempNodeKey = node.key
        const tempNodeValue = node.value

        if (node.prev) {
            node.prev.next = node.next
        }
        if (node.next) {
            node.next.prev = node.prev
        }

        node.next = null
        node.prev = null

        this.length--;

        return this.insertBeginning(tempNodeKey, tempNodeValue);
    }

    deleteBeginning() {
        if (this.length === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.prev;
            this.head.next = null;
        }
        this.length--;
    }

    //end(tail) will be considered least recent
    removeEnd() {
        let tempTail = this.tail;
        if (this.length === 0) {
            return null;
        }
        if (this.length == 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.next;
            this.tail.prev = null;
            tempTail.next = null;
        }
        this.length--;
        return tempTail;   
    }

    //used in debugging to see contents of DLL
    getList() {
        let dllArr = [];
        let currNode = this.head;
        while(currNode != null) {
            dllArr.push({key: currNode.key,value: currNode.value})
            currNode = currNode.prev;
        }
        return dllArr;
    }
}

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}


module.exports = {DoublyLinkedList};