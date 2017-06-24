import {
  createActionCreator,
  MappedPipeReducer,
  PayloadAction,
  PureAction,
  Reducer,
} from '../lib'
import { createStore } from 'redux'

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

type Action = Actions.PlusAction | Actions.SetAction

const ActionCreators = {
  plus: createActionCreator<Actions.PlusAction>(ActionTypes.Plus),
  set: createActionCreator<Actions.SetAction>(ActionTypes.Set),
}

interface State {
  count: number
  dispatchCount: number
}

const initialState: State = {
  count: 0,
  dispatchCount: 0
}

const plusSubReducer = (state: State, action: Actions.PlusAction) => ({
  ...state,
  count: state.count + 1,
})

const setSubReducer: Reducer<State, Actions.SetAction> = (state, action) => ({
  ...state,
  ...action.payload,
})

// This reducer will be used when dispatching both actions, PlusAction and SetAction
const masterReducer: Reducer<State, Action> = (state, action) => ({
  ...state,
  dispatchCount: state.dispatchCount + 1
})

// As we said in `./mapped-reducer.spec.ts`, we could give only State type.
const reducer = new MappedPipeReducer<State>()

reducer
  .set(ActionTypes.Plus, plusSubReducer)
  .set(ActionTypes.Set, setSubReducer)
  // reducer#add appends reducer to the previous rather than replacing
  .add([
    ActionTypes.Plus,
    ActionTypes.Set,
  ], masterReducer)

const store = createStore(reducer.reduce, initialState)

test('MappedPipeReducer', () => {
  // As you see, our reducers are set as an Array
  expect(reducer.get(ActionTypes.Plus)).toEqual([
    plusSubReducer,
    masterReducer,
  ])

  const plusAction = ActionCreators.plus()
  store.dispatch(plusAction)

  const firstReducedState = store.getState()
  expect(firstReducedState).toEqual({
    count: 1,
    dispatchCount: 1,
  })

  const setAction = ActionCreators.set({
    count: 0,
  })
  store.dispatch(setAction)

  const secondReducedState = store.getState()
  expect(secondReducedState).toEqual({
    count: 0,
    dispatchCount: 2,
  })

  // Append plusSubReducer again
  reducer.add(ActionTypes.Plus, plusSubReducer)
  store.dispatch(plusAction)

  // Now it reduces plusSubReducer twice
  const thirdReducedState = store.getState()
  expect(thirdReducedState).toEqual({
    count: 2,
    dispatchCount: 3,
  })

  // Reset reducer for ActionTypes.Plus
  reducer.set(ActionTypes.Plus, [plusSubReducer, masterReducer])
  store.dispatch(plusAction)

  // Now it reduces only once
  const forthReducedState = store.getState()
  expect(forthReducedState).toEqual({
    count: 3,
    dispatchCount: 4,
  })
})
