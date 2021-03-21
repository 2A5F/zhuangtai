import { LiteralObj } from "libsugar"

export interface Store<T, A extends unknown[] = []> {
    (...args: A): T
}

export type AnyStore = Store<any, any>

export type StoreType<S> = S extends Store<infer T, any> ? T : never
export type StoreArgs<S> = S extends Store<any, infer A> ? A : never

export function store<T, A extends unknown[] = []>(def: (...args: A) => T): Store<T, A>
export function store<T, A extends unknown[] = []>(def: new (...args: A) => T): Store<LiteralObj<T>, A>
export function store<T, A extends unknown[] = []>(def: ((...args: A) => T) | (new (...args: A) => T)): Store<LiteralObj<T>, A>
export function store<T, A extends unknown[] = []>(def: ((...args: A) => T) | (new (...args: A) => T)): Store<LiteralObj<T>, A> {
    return (...args: A) => {
        try {
            return new (def as any)(...args)
        } catch {
            return (def as any)(...args)
        }
    }
}
