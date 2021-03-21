import { store, useStore } from '.'

const Counter = store(class {
    count = 1
})

function Inc() {
    const counter = useStore(Counter)
    
}