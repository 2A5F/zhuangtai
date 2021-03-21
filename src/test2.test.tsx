import React from 'react'
import { create, usePath, make } from '.'
import { action } from './core'

const Count = create({
    count: 1
})

const Counter = make(Count, action(Count, {
    inc([self]) {
        self.count++
    }
}))

export function Inc() {
    const inc = Counter.inc
    const count = usePath(Count, s => s.count)

    return <div>
        <p>{count}</p>
        <button onClick={inc}>++</button>
    </div>
}
