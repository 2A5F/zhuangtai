
class Count {
    count = 1
}

class Adder extends Count {
    add(v: number) {
        this.count += v
    }
}

class Counter extends Adder {
    inc() {
        this.add(1)
    }
}

const counter = new Counter

counter.inc()
counter.count

