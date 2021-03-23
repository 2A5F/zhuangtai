import React from 'react'
import { store, useStore } from '.'
import { action } from './core'

const Count = store(class {
    count = 1
})

const Adder = action(Count, {
    add([self], v: number) {
        self.count += v
    }
})

const Counter = action(Adder, {
    inc([, base]) {
        base.add(1)
    }
})

export function Inc() {
    const store = useStore(Count)
    const inc = store.use(Counter).inc
    const count = store.use(s => s.count)

    return <div>
        <p>{count}</p>
        <button onClick={inc}>++</button>
    </div>
}
