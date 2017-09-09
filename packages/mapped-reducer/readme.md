# MappedReducer - Typed Redux Kit

An efficient reducer exploiting ES6 Map for better lookup!

## Examples

```ts
import { MappedReducer } from 'typed-redux-kit.mapped-reducer'

enum ActionTypes {
  Plus = 'test_Plus',
  Set = 'test_Set',
  SayHello = 'test_SayHello',
  SayBye = 'test_SayBye',
}

namespace Actions {
  export interface Plus extends PureAction<ActionTypes.Plus> {}

  export interface Set extends PayloadAction<ActionTypes.Set, {
    count: number
  }> {}
}

interface State {
  count: number
  message: string
}

const plusSubReducer = (state: State, action: Actions.PlusAction) => ({
  ...state,
  count: state.count + 1,
})

const setSubReducer = (state: State, action: Actions.SetAction) => ({
  ...state,
  ...action.payload,
})

const reducer = new MappedReducer<State>({
  initialState: {
    count: 0,
    message: 'No message!',
  },
})

reducer
  .set(ActionTypes.Plus, plusSubReducer)
  .set(ActionTypes.Set, setSubReducer)

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
    message: 'No message!',
  },
})

reducer
  .set(ActionTypes.Plus, plusSubReducer)
  .set(ActionTypes.Set, setSubReducer)
  .set([
    ActionTypes.Plus,
    ActionTypes.Set,
  ], sayReducer)
```

Now, the both actions will be passed to `sayReducer`

And, for more convinence, **it accepts string enum**!

```ts
reducer
  .set(ActionTypes.Plus, plusSubReducer)
  .set(ActionTypes.Set, setSubReducer)
  .set(ActionTypes, sayReducer)
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

Delete a subreducer for an action type.

#### `#get(actionType): Reducer`

Get a subreducer for an action type.

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

MappedPipeReducer can have multiple sub reducers for a single action type.

#### `#unshift(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Prepend a subreducer to subreducer array of an action type.

### `#prepend(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Alias of `#unshift`

#### `#push(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Append a subreducer to subreducer array of an action type.

### `#append(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Alias of `#push`

#### `#set(actionTypes: Action | Action[], reducerOrReducers: Reducer | Reducer[])`

Replace subreducer array of an action type.

#### `#delete(actionTypes: Action | Action[]): this`

Delete all subreducers registered to an action type.

#### `#get(actionType: Action)`

Almost same to `MappedReducer#get`, but returns an array of reducers.

#### `#reduce(state: State, action: Action)`

Same to `MappedReducer#reduce`.
