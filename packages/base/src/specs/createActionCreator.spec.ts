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
  expect(plusAction).toEqual({
    type: ActionTypes.Plus,
  })

  const setAction = ActionCreators.set({
    count: 123,
  })

  expect(setAction).toEqual({
    type: ActionTypes.Set,
    payload: {
      count: 123,
    },
  })
})
