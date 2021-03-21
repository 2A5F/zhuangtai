import { LiteralObj } from "libsugar"

export interface Store<T, A extends unknown[] = []> {
    (...args: A): T
}

export type AnyStore = Store<any, any>

export type StoreType<S> = S extends Store<infer T, any> ? T : never
export type StoreArgs<S> = S extends Store<any, infer A> ? A : never

export interface IAction<S, B extends Action<S, any, any>> {
    [name: string]: (ctx: [store: S, base: ActionInstance<B>], ...args: any[]) => any
}

export type AnyIAction = IAction<any, any>

export interface Action<S, A extends IAction<S, B>, B extends Action<S, any, any>> {
    action: A
    base: B
}

export type AnyAction = Action<any, any, any>

type ActionFnNoCtx<F> = F extends (ctx: any, ...args: infer A) => infer R ? (...args: A) => R : F
type ActionNoCtx<A extends AnyAction> = { [K in keyof A]: ActionFnNoCtx<A[K]> }

export type ActionStore<A extends AnyAction> = A extends Action<infer S, any, any> ? S : never
export type ActionBase<A extends AnyAction> = A['base']
export type ActionAction<A extends AnyAction> = A['action']

export type ActionInstance<A extends AnyAction> = LiteralObj<ActionExclude<ActionNoCtx<A['action']>, ActionBase<A>>>
type ActionExclude<A extends AnyIAction, B extends AnyAction> = B | 0 extends 0 ? A : Omit<ActionInstance<B>, keyof A> & A

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

const Actions = new WeakSet<AnyAction>()

export function action<S extends AnyStore, A extends IAction<StoreType<S>, never>>(store: S, action: A): Action<StoreType<S>, A, never>
export function action<B extends AnyAction, A extends IAction<ActionStore<B>, B>>(base: B, action: A): Action<ActionStore<B>, A, B>
export function action<A extends IAction<any, any>>(base: any, action: A): AnyAction {
    let r: AnyAction
    if (Actions.has(base)) r = { action, base }
    else r = { action } as any
    Actions.add(r)
    return r
}
