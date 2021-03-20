type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export interface Store<T, A extends unknown[] = []> {
    def: (...args: A) => T
}

export type StoreType<S> = S extends Store<infer T, any> ? T : never
export type StoreArgs<S> = S extends Store<any, infer A> ? A : never

export interface Action<S extends Store<any, any> | Action<any, any>, A extends ActionObj<S>> {
    base: S
    action: A
}

export type ActionObj<S> = Record<string, ActionFn<S>>
export type ActionFn<S> = (this: StoreOrActionType<S>, ...args: any[]) => any

export type ActionBase<A> = A extends Action<any, any> ? A['base'] : never
export type ActionAction<A> = A extends Action<any, any> ? A['action'] : never
type ActionStoreLoop<T> = Action<ActionStoreLoop<T> | (T extends Store<any, any> ? T : never), any>
export type ActionStore<A> = A extends ActionStoreLoop<infer S> ? S : never 
export type ActionType<A> = StoreType<ActionStore<A>>
export type ActionArgs<A> = StoreArgs<ActionStore<A>>
export type StoreOrActionType<S> = S extends Store<infer T, any> ? T : ActionType<S>

export interface Instance<T> {
    use<R>(selector: (s: T) => R): R
    map<R>(selector: (s: T) => R): Instance<R>
    get(): T
    set(v: T): void
}

export function store<T extends object, A extends unknown[]>(def: (...args: A) => T): Store<T, A>
export function store<T extends object>(def: () => T): Store<T>
export function store(def: any): any {
    return { def }
}

export function action<S extends Store<any, any> | Action<any, any>, A extends ActionObj<S>>(store: S, action: A): Action<S, A> {
    return {
        base: store,
        action,
    }
}

let a = store(() => ({ count: 1 }))
let b = action(a, {
    inc() {
        this.count++
    }
})
let c = action(b, {
    reset() {
        this.count = 0
    }
})
let d = make(c)
d.inc()

type NoThis<T> = T extends (this: any, ...args: infer A) => infer R ? (...args: A) => R : T
type ObjWithOutThis<T> = { [K in keyof T]: NoThis<T[K]> }

type DeepTuple<T> = [T] | [T, DeepTuple<T>]
type GetDeepTuple<T> = T extends DeepTuple<infer R> ? R : never

type LiteralObj<T> = T extends object ? { [K in keyof T]: T[K] } : never

type MergeActionTuple<A extends Action<any, any>> = ActionBase<A> extends Store<any, any> ? [ActionAction<A>] : [ActionAction<A>, MergeActionTuple<ActionBase<A>>]
type MergeAction<A extends Action<any, any>> = GetDeepTuple<MergeActionTuple<A>>

export type ActionToInstance<A extends Action<any, any>> = Instance<ActionType<A>> & ObjWithOutThis<LiteralObj<UnionToIntersection<MergeAction<A>>>>

export function make<A extends Action<any, any>>(action: A, ...args: ActionArgs<A>): ActionToInstance<A>
export function make<T>(store: Store<T>): Instance<T>
export function make<T, A extends unknown[]>(store: Store<T, A>, ...args: A): Instance<T>
export function make<T, A extends unknown[]>(store: Store<T, A>, ...args: A): Instance<T> {
    let data = store.def(...args)
    return {
        use<R>(selector: (s: T) => R): R {
            return selector(data)
        },
        map<R>(selector: (s: T) => R): Instance<R> {
            return make({ def() { return selector(data) } })
        },
        get(): T {
            return data
        },
        set(v: T): void {
            data = v
        },
    }
}
