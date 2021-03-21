import { LiteralObj } from 'libsugar'
import { Store, store } from './core'
import { make } from './make'

export * from './core'
export * from './make'
export * from './hook'

export function define<T, A extends unknown[] = []>(def: (...args: A) => T): Store<T, A>
export function define<T, A extends unknown[] = []>(def: new (...args: A) => T): Store<LiteralObj<T>, A>
export function define<T, A extends unknown[] = []>(def: ((...args: A) => T) | (new (...args: A) => T)): Store<LiteralObj<T>, A>
export function define<T, A extends unknown[] = []>(def: ((...args: A) => T) | (new (...args: A) => T)): Store<LiteralObj<T>, A> {
    return store(def)
}

export function create<T extends object>(def: T): T
export function create<T>(def: () => T): T
export function create<T>(def: new () => T): LiteralObj<T>
export function create<T>(def: (() => T) | (new () => T)): LiteralObj<T>
export function create<T>(def: T | (() => T) | (new () => T)): LiteralObj<T> {
    if (typeof def === 'function') return make(store(def as any))
    return make(() => def as any)
}
