# Trackable - Typed Redux Kit

Modify your state mutably!

Trackable will track the mess you've done and make sure the modified state stays shiny new.

## Install

```sh
npm i typed-redux-kit.trackable

# Or install typed-redux-kit
npm i typed-redux-kit
```

## Examples

```ts
import * as Redux from 'redux'
import {
  trackEnhancer,
  TrackableRecord,
  TrackableMap,
} from '../lib'

const CountRecord = TrackableRecord({
  count: 0,
})
type CountRecord = TrackableRecord<{
  count: number
}>
type State = TrackableMap<string, CountRecord>
const defaultChildState = CountRecord({
  count: 0,
})
const defaultState: State = new TrackableMap({
  a: defaultChildState,
})

const myReducer = (state: State = defaultState, action: Redux.Action) => {
  if (action.type === 'add') {
    // You can change the data mutably!
    state.get('a').count++
  }
  return state
}
// Because track enhancer will renew all tracked changes.
const store = Redux.createStore(myReducer, trackEnhancer)

store.dispatch({
  type: 'add',
})

const reducedState = store.getState()
expect(reducedState.get('a').count).toBe(1)
// We've modified mutably, but reduced state is different instance!
expect(reducedState).not.toBe(defaultState)
```

## Why?

Handling a state with deep depth is very painful. If you don't use Immutable, you should do like this:

```ts
const myReducer = (state, action) => ({
  ...state,
  depth1: {
    ...state.depth1,
    depth2: {
      ...state.depth2,
      depth3: {
        ...state.depth3,
        depth4: action.payload
      },
    },
  },
})
```

It is super verbose so I've found lots of people make mistake when handling this kind of structure.

In this case, Immutable.js can fix.

```ts
const myReducer = (state, action) => (
  state.setIn(['depth1', 'depth2', 'depth3', 'depth4'], action.payload)
)
```

But, here comes another problem. Its `getIn`, `setIn` and kind of `...In` methods takes string array to resolve keys. So, type inference of typescript doesn't work at all. To keep typeinference working, you have to do like this.

```ts
const myReducer = (state, action) => (
  state
    .update('depth1', depth1 => depth1
      .update('depth2', depth2 => depth2
        .update('depth3', depth3 => depth3
          .update('depth4', depth4 => action.payload)
        )
      )
    )
)
```

This is horrible.

But with Trackable, you can do like this:

```ts
const myReducer = (state, action) => {
  state.depth1.depth2.depth3.depth4 = action.payload
  return state
}
```

So, you don't have to worry your state is immutable. Also, type inference againt every depth works perfectly.

## Todo

- Set
- HAMT(Hashed Array Map Tree which Immutable.js has)

## Polyfill

Trackable is using Object.values and Object.entries. If you need to support legacy Node.js or browser, use the below polyfill or transpile again with babel

```ts
// Polyfill
const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
const concat = Function.bind.call(Function.call, Array.prototype.concat)
const keys = Reflect.ownKeys

if (!Object.values) {
  Object.values = function values<T extends {}, K extends keyof T>(O: T) {
    return reduce(keys(O), (v: T[K], k: K) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
  }
}

if (!Object.entries) {
  Object.entries = function entries<T extends {}, K extends keyof T>(O: T) {
    return reduce(keys(O), (e: Array<[K, T]>, k: K) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), [])
  }
}
```

## Author & Maintainer

- [Stuart Schechter](https://github.com/UppaJung) : Author
- [Junyoung Choi](https://github.com/rokt33r) : Author & Maintainer

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
