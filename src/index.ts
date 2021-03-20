export * from './core'
import { store, Store, Instance } from './core'
export default store

export function useStore<T>(store: Store<T>): Instance<T>
export function useStore<T, A extends unknown[]>(store: Store<T, A>, ...args: A): Instance<T>
export function useStore(store: Store<any>, ...args: unknown[]): any {

}
