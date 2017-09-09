import {
  createActionCreator,
  PayloadAction,
  PureAction,
} from '..'

enum ActionTypes {
  Plus = 'Plus',
  Set = 'Set',
}

namespace Actions {
  export type PlusAction = PureAction<ActionTypes.Plus>
  export type SetAction = PayloadAction<ActionTypes.Set, {
    count: number
  }>
}

const ActionCreators = {
  plus: createActionCreator<Actions.PlusAction>(ActionTypes.Plus),
  set: createActionCreator<Actions.SetAction>(ActionTypes.Set),
}

test('createActionCreator', () => {
  const plusAction = ActionCreators.plus()

  // $ExpectError : it doesn't take any payload
  // const plusAction = ActionCreators.plus(123)

  expect(plusAction).toEqual({
    type: ActionTypes.Plus,
  })

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
