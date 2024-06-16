
class List {

    head;
    tail;
    count;

    constructor(head = null) {
        this.head = head;
        this.tail = head;
        this.count = (head === null) ? 0 : 1;
    }

    getFirst() {
        return this.head;
    }

    getLast() {
        return this.tail;
    }

    append(data) {
        let item = new Item(data);

        if (this.count === 0) {
            this.head = item;
            this.tail = item;
        } else {
            this.tail.next = item;
            item.prev = this.tail;
            this.tail = item;
        }

        ++this.count;
    }

    remove(index) {
        if (index < 0 || index >= this.count) {
            throw new RangeError();
        } else if (this.count === 0) {
            throw new Error("Error: No items to remove");
        }

        if (index === 0) {
            if (this.count === 1) {
                this.head = null;
                this.tail = null;
                return;
            }

            let next = this.head.next;

            next.prev = null;
            this.head.next = null;
            this.head = next;
        } else if (index === this.count - 1) {
            let prev = this.tail.prev;

            prev.next = null;
            this.tail.prev = null;
            this.tail = prev;
        } else {
            let i = 0;
            let item = this.head;
            let next;
            let prev;

            while (item.next) {
                item = item.next;
                ++i;

                if (i === index) {
                    next = item.next;
                    prev = item.prev;

                    prev.next = next;
                    next.prev = prev;
                    item.next = null;
                    item.prev = null;

                    break;
                }
            }
        }

        --this.count;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    size() {
        return this.count;
    }

}

class Item {

    data;
    next = null;
    prev = null;

    constructor(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

}

module.exports = {
    List,
    Item
}
