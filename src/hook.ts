import { observable } from 'mobx'
import { useState } from 'react'
import { AnyStore, StoreArgs, StoreType } from './core'

export function useStore<S extends AnyStore>(store: S, argf?: () => StoreArgs<S>): StoreType<S> {
    return useState(() => {
        const args = argf?.() ?? []
        const data = store(...(args as any))
        if (typeof data === 'object') return observable(data)
        return data
    })[0]
}
