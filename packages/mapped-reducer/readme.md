# MappedReducer - Typed Redux Kit

An efficient reducer exploiting ES6 Map for better lookup!

## Install

```sh
npm i typed-redux-kit.mapped-reducer

# Or install typed-redux-kit
npm i typed-redux-kit
```

## Examples

```ts
import { createStore } from 'redux'
import { MappedReducer } from 'typed-redux-kit.mapped-reducer'
import {
  PureAction,
  PayloadAction,
} from 'typed-redux-kit.base'

enum ActionTypes {
  Plus = 'test_Plus',
  Set = 'test_Set',
}

namespace Actions {
  export interface Plus extends PureAction<ActionTypes.Plus> {}

  export interface Set extends PayloadAction<ActionTypes.Set, {
    count: number
  }> {}
}

interface State {
  count: number
}

const plusReducer = (state: State, action: Actions.PlusAction) => ({
  ...state,
  count: state.count + 1,
})

const setReducer = (state: State, action: Actions.SetAction) => ({
  ...state,
  ...action.payload,
})

const reducer = new MappedReducer<State>({
  initialState: {
    count: 0,
  },
})

reducer
  .set(ActionTypes.Plus, plusReducer)
  .set(ActionTypes.Set, setReducer)

const store = createStore(reducer.reduce)
store.dispatch({
  type: ActionTypes.Plus,
} as Actions.Plus)
```

If you want to set multiple reducers for one action, Try `MappedPipeReducer`.

```ts
import { MappedPipeReducer } from 'typed-redux-kit.mapped-reducer'

const reducer = new MappedPipeReducer<State>({
  initialState: {
    count: 0,
  },
})

reducer
  .set(ActionTypes.Plus, plusReducer)
  .set(ActionTypes.Set, setReducer)
  .set([
    ActionTypes.Plus,
    ActionTypes.Set,
  ], anotherReducer)
```

Now, the both actions will be passed to `sayReducer`

And, for more convinence, **it accepts string enum**!

```ts
reducer
  .set(ActionTypes.Plus, plusReducer)
  .set(ActionTypes.Set, setReducer)
  .set(ActionTypes, anotherReducer)
```

## Why it is good?

`combineReducer` always pass action to every its subreducer. When you build huge app, you probably have lots of reducers, splitted by domain. Here comes the problem. Although you've already splitted your reducers, every action will be passed to the reducer regardless your intention.

Also, if you have lots of action types, lookup with Map is more efficient than one with `switch` statement. This is because Map keep a key as a hash.

## APIs

### `MappedReducer({initialState?: State})`

Basic mapped reducer. It takes only option, `initialState`.

#### `#set(actionTypes: Action | Action[], reducer: Reducer): this`

Set a subreducer for the given action type(s).

It takes a single action type and array/string enum of action types.

> You can set only one subreducer for a single action type. If you want to set more than two, use `MappedPipeReducer`.

#### `#delete(actionTypes: Action | Action[]): this`

Delete a subreducer for the given action type(s).

#### `#get(actionType): Reducer`

Get a subreducer for the given action type(s).

#### `#reduce(state: State, action: Action): State`

This is the actual reducing method. You should pass this to `createStore` or `combineReducers`.

```ts
import {
  createStore,
  combineReducers,
} from 'redux'

// To store
const store = createStore(reducer.reduce)

// To combine reducer
const masterReducer = combineReducers({
  slave1: reducer.reduce,
  slave22: reducer2.reduce,
})
```

### `MappedPipeReducer({initialState?: State})`

MappedPipeReducer can have multiple sub reducers for the given action type(s).

#### `#unshift(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Prepend a subreducer to subreducer array of the given action type(s).

### `#prepend(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Alias of `#unshift`

#### `#push(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Append a subreducer to subreducer array of the given action type(s).

### `#append(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Alias of `#push`

#### `#set(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Replace subreducer array of the given action type(s).

#### `#delete(actionTypes: Action | Action[]): this`

Delete all subreducers registered to the given action type(s).

#### `#get(actionType: Action)`

Almost same to `MappedReducer#get`, but returns an array of reducers.

#### `#reduce(state: State, action: Action)`

Same to `MappedReducer#reduce`.

## Polyfill

MappedReducer is using Object.values. If you need to support legacy Node.js or browser, use the below polyfill or transpile again with babel

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
```

## Author & Maintainer

- [Stuart Schechter](https://github.com/UppaJung) : Author
- [Junyoung Choi](https://github.com/rokt33r) : Author & Maintainer

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
