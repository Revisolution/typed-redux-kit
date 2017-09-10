# Base - Typed Redux Kit

Tools for basic usage of redux with Typescript

It provides several convenient interfaces and functions to define `Redux.Action`.

## Install

```sh
npm i typed-redux-kit.base

# Or install typed-redux-kit
npm i typed-redux-kit
```

## Examples

```ts
import {
  createActionCreator,
  PayloadAction,
  PureAction,
} from 'typed-redux-kit.base'

// Define action types with string enum
enum ActionTypes {
  Plus = 'Plus',
  Set = 'Set',
}

// Define action interfaces
namespace Actions {
  export type PlusAction = PureAction<ActionTypes.Plus>
  export type SetAction = PayloadAction<ActionTypes.Set, {
    count: number
  }>
}

// Define action creators
const ActionCreators = {
  plus: createActionCreator<Actions.PlusAction>(ActionTypes.Plus),
  set: createActionCreator<Actions.SetAction>(ActionTypes.Set),
}

test('createActionCreator', () => {
  // Create action without any payload
  const plusAction = ActionCreators.plus()

  // $ExpectError : it doesn't take any payload
  // const plusAction = ActionCreators.plus(123)

  expect(plusAction).toEqual({
    type: ActionTypes.Plus,
  })

  // Crate action with the specific payload
  const setAction = ActionCreators.set({
    count: 123,
  })

  // $ExpectError : `count` must be a number
  // const setAction = ActionCreators.set({ count: '123'})
  // $ExpectError : payload is required
  // const setAction = ActionCreators.set()

  expect(setAction).toEqual({
    type: ActionTypes.Set,
    payload: {
      count: 123,
    },
  })
})
```

## APIs

### `PureAction<ACTION_TYPE>` interface

`Redux.Action` without any properties.

### `PureAction<ACTION_TYPE, PAYLOAD_TYPE>` interface

`Redux.Action` with `payload` property.

### `Action` type

An union type of `PureAction` and `PureAction`

### `createActionCreator<ACTION extends Action>(actionType)`

It returns an action creator, which passes the first argument to the payload property of an `Redux.Action`.

This is very simple function. The only benefit of this is that you can create strictly typed action creators with less typings.

```ts
// With createActionCreator
createActionCreator<Actions.PlusAction>(ActionTypes.Plus)

// Same to the above
(payload) => ({
  type: ActionTypes.Plus,
  payload,
})
```

## Authors

- [Stuart Schechter](https://github.com/UppaJung)
- [Junyoung Choi](https://github.com/rokt33r) : Maintainer
- [Joseph Stein](https://github.com/josephstein)

## License & Copyright

Licensed under MIT
Copyright 2017 Revisolution
