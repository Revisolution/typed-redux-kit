import { createStore, Action, StoreCreator, Store, StoreEnhancer } from 'redux'
import * as Redux from 'redux'
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga'
import { fork, take, put } from 'redux-saga/effects'
import { batchable, batchEnhancer } from '../lib/batched-actions'

test('batch', () => {
  const BatchActionType = '@@typed-redux/batched-actions'

  interface State {
    count: number
  }
  const initialState: State = {count: 0}

  const myReducer = batchable((state: State, action) => {
    if (action.type === 'SayHello') {
      return {
        count: state.count + 1
      }
    }

    return state
  })

  const sagaMiddleware: SagaMiddleware<State> = createSagaMiddleware()
  const store = createStore<State>(myReducer, initialState, batchEnhancer(sagaMiddleware))

  const output = {
    helloSagaCalled: 0,
    byeSagaCalled: 0,
    listenerCalled: 0
  }

  store.subscribe(() => {
    output.listenerCalled++
  })

  function * sayHello () {
    while (true) {
      yield take('SayHello')
      output.helloSagaCalled++

      // Inside of saga, you can dispatch batch action
      yield put({
        type: BatchActionType,
        actions: [
          {
            type: 'SayBye'
          },
          {
            type: 'SayBye'
          },
          {
            type: 'SayBye'
          },
      ]})
    }
  }

  function * sayBye () {
    while (true) {
      yield take('SayBye')
      output.byeSagaCalled++
    }
  }

  sagaMiddleware.run(function *() {
    yield fork(sayHello)
    yield fork(sayBye)
  })

  // Dispatch batch action
  store.dispatch({
    type: BatchActionType,
    actions: [
      {
        type: 'SayHello'
      },
      {
        type: 'SayHello'
      },
      {
        type: 'SayHello'
      }
    ]
  })

  // Dispath single action
  store.dispatch({
    type: 'SayHello'
  })

  // Although our reducer and saga will be called 4 times,
  // the listener will be called only 2 times.
  expect(output).toEqual({
    byeSagaCalled: 4 * 3,
    helloSagaCalled: 4,
    listenerCalled: 2 + 4
  })
  expect(store.getState().count).toEqual(4)
})
