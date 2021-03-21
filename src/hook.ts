import { observable } from 'mobx'
import { useState } from 'react'
import { Action, ActionInstance, AnyStore, StoreArgs, StoreType } from './core'
import { make } from './make'

export interface Instance<T> {
    val: T
    get(): T
    use<R>(path: (store: T) => R): R
    use<A extends Action<T, any, any>>(action: A): ActionInstance<A>
}

export function useStore<S extends AnyStore>(store: S, argf?: () => StoreArgs<S>): Instance<StoreType<S>> {
    return useState(() => {
        const args = argf?.() ?? []
        const data = store(...(args as any))
        let r: any
        if (typeof data === 'object') r = observable(data)
        else r = data
        return {
            store: r,
            get() { return r },
            use(path: any) {
                if (typeof path === 'function') return usePath(r, path)
                return usePath(r, path)
            },
        } as any
    })[0]
}

export function usePath<T, R>(store: Instance<T>, path: (store: T) => R): R {
    return path(store.val) // todo
}

export function useAction<S, A extends Action<S, any, any>>(store: Instance<S>, action: A): ActionInstance<A> {
    return useState(() => make(store.val, action))[0]
}
