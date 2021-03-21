import React from 'react'
import { store, useStore } from '.'
import { action } from './core'

const Count = store(class {
    count = 1
})

const Counter = action(Count, {
    inc([self]) {
        self.count++
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
