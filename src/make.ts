import { observable, action as mobxAction } from "mobx"
import { ActionInstance, Action, AnyStore, StoreArgs, StoreType } from "./core"

//@ts-ignore
export declare function make<S, A extends Action<S, any, any>>(store: S, action: A): ActionInstance<A>
//@ts-ignore
export declare function make<S extends AnyStore>(store: S, ...args: StoreArgs<S>): StoreType<S>
export function make(a: any, ...args: any) {
    if (typeof a === 'function') return $makeStore(a, ...args)
    return ($makeAction as any)(a, args[0])
}

function $makeStore<S extends AnyStore>(store: S, ...args: StoreArgs<S>): StoreType<S> {
    const data = store(...(args as any))
    if (typeof data === 'object') return observable(data)
    return data
}

function $makeAction<S, A extends Action<S, any, any>>(store: S, action: A): ActionInstance<A> {
    let base: any
    const obj = action.base == null ? {} : base = Object.create(($makeAction as any)(store, action.base))
    for (const [k, v] of Object.entries(action.action) as [string, any][]) {
        if (typeof v !== 'function') Object.defineProperty(obj, k, { value: v })
        const bindf = function (...args: any) { return v.call(obj, [store, base], ...args) }
        Object.defineProperty(obj, k, { value: mobxAction(bindf) })
    }
    return obj
}
