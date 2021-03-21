import { observable } from "mobx"
import { AnyStore, StoreArgs, StoreType } from "./core"

export function make<S extends AnyStore>(store: S, ...args: StoreArgs<S>): StoreType<S> {
    const data = store(...(args as any))
    if (typeof data === 'object') return observable(data)
    return data
}
