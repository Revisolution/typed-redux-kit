import * as Redux from 'redux'
import createSagaMiddleware from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import {
  trackEnhancer,
  batchEnhancer,
  TrackableRecord,
  MappedPipeReducer,
  createActionCreator,
  PureAction,
} from '../lib'

/**
 * Actions
 */

enum ActionTypes {
  SayHello = 'SayHello',
  SayBye = 'SayBye',
}

namespace Actions {
  export type SayHello = PureAction<ActionTypes.SayHello>
  export type SayBye = PureAction<ActionTypes.SayBye>
}

const ActionCreators = {
  sayHello: createActionCreator<Actions.SayHello>(ActionTypes.SayHello),
  sayBye: createActionCreator<Actions.SayBye>(ActionTypes.SayBye),
}

interface State {
  message: string,
  count: number,
}

/**
 * Reducers
 */

type StateRecord = TrackableRecord<State>
const StateRecord = TrackableRecord<State>({
  message: '',
  count: 0,
})
const initialState = StateRecord()

const sayHelloReducer = (state: StateRecord, action: Actions.SayHello) => {
  state.message = 'hello'
  return state
}

const sayByeReducer = (state: StateRecord, action: Actions.SayBye) => {
  state.message = 'bye'
  return state
}

const masterReducer = (state: StateRecord, action: Redux.Action) => {
  state.count++
  return state
}

const reducer = new MappedPipeReducer<StateRecord>()
reducer.set(ActionTypes.SayHello, sayHelloReducer)
reducer.set(ActionTypes.SayBye, sayByeReducer)
reducer.append(ActionTypes, masterReducer)

/**
 * Saga
 */

const dummyFn = jest.fn()
function * saga () {
  while (true) {
    yield take(ActionTypes.SayHello)
    yield call(dummyFn)
    yield put([
      ActionCreators.sayBye(),
      ActionCreators.sayBye(),
    ])
  }
}

test('Basic usage', () => {
  // Given
  const sagaMiddleware = createSagaMiddleware()
  const enhancer = Redux.compose<Redux.StoreEnhancerStoreCreator<StateRecord>>(trackEnhancer, batchEnhancer(sagaMiddleware))
  const store = Redux.createStore<StateRecord>(reducer.reduce, initialState, enhancer)
  sagaMiddleware.run(saga)

  // When
  store.dispatch([
    ActionCreators.sayHello(),
    ActionCreators.sayHello(),
  ])

  // Then
  const state = store.getState()
  expect(state.message).toBe('hello')
  expect(state.count).toBe(6)
  expect(state).not.toBe(initialState)
})
