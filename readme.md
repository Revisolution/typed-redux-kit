# Typed Redux Kit

Toolkit for Redux with Typescript

## What the heck is this?

- Guide for using redux with Typescript
- Several sweet scaffoldings(createActionCreators, MappedReducer, ...)

```ts
import {
  createActionCreator,
  MappedReducer,
  PayloadAction,
  PureAction,
  Reducer,
} from 'typed-redux-kit'

// Prepare actions
enum ActionTypes {
  Plus = 'test_Plus',
  Set = 'test_Set',
}

namespace Actions {
  export interface PlusAction extends PureAction<ActionTypes.Plus> {}
  export interface SetAction extends PayloadAction<ActionTypes.Set, {
    count: number
  }> {}
}

const ActionCreators = {
  plus: createActionCreator<Actions.PlusAction>(ActionTypes.Plus),
  set: createActionCreator<Actions.SetAction>(ActionTypes.Set),
}

// State types and initial state
interface State {
  count: number
}

const initialState: State = {
  count: 0
}

// Create reducer just for plus action only
const plusSubReducer = (state: State, action: Actions.PlusAction) => ({
  ...state,
  count: state.count + 1,
})
// You also can give the type, we prepared, explicitly
const setSubReducer: Reducer<State, Actions.SetAction> = (state, action) => ({
  ...state,
  ...action.payload,
})

// Create reducer(with type filter by generic<ActionTypes>)
const reducer = new MappedReducer<State, ActionTypes>()
  // Just like switch, but our mapped reducer uses cached references!(Native Map)
  // So, it should perform better than switch for most cases.
  .set(ActionTypes.Plus, plusSubReducer)
  .set(ActionTypes.Set, setSubReducer)
  // Also, These wrong usage will thorw compiler errors
  // because our reducer is smart enough.
  //
  // Wrong ActionType and Sub Reducer combination
  //
  // .set(ActionTypes.Set, plusSubReducer)
  // .set(ActionTypes.Plus, setSubReducer)
  //
  // Invalid Action Types
  // .set('UNWELCOMMED', plusSubReducer)

// Reducer has a reduce method, `reducer.reduce`. Just pass it to our store!
const store = createStore(reducer.reduce, initialState)

test('MappedReducer', () => {
  expect(reducer.get(ActionTypes.Plus)).toEqual(plusSubReducer)

  const plusAction = ActionCreators.plus()
  store.dispatch(plusAction)
  const firstReducedState = store.getState()
  expect(firstReducedState).toEqual({
    count: 1
  })

  const setAction = ActionCreators.set({
    count: 0,
  })
  store.dispatch(setAction)

  const secondReducedState = store.getState()
  expect(secondReducedState).toEqual({
    count: 0,
  })
})
```

## How to use

Please check `specs/*.spec.ts`! We've already prepared tons of comments there!

1. [Basic usage & MappedReducer](./src/specs/mapped-reducer.spec.ts)
2. [MappedPipeReducer](./src/specs/mapped-pipe-reducer.spec.ts)
3. [MappedUniquePipeReducer](./src/specs/mapped-unique-pipe-reducer.spec.ts)

## Author & Maintainer

- [Stuart Schechter](https://github.com/UppaJung) : Author (He made most concepts of this library)
- [Junyoung Choi](https://github.com/rokt33r) : Author & Maintainer

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
