import { createStore, Action, StoreCreator, Store, StoreEnhancer } from 'redux'
import * as Redux from 'redux'
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga'
import { fork, take, put } from 'redux-saga/effects'
import { batchEnhancer } from '../lib'

test('batch', () => {
  interface State {
    count: number
  }
  const initialState: State = {count: 0}

  const myReducer = (state: State, action: Redux.Action) => {
    if (action.type === 'SayHello') {
      return {
        count: state.count + 1,
      }
    }

    return state
  }

  const sagaMiddleware: SagaMiddleware<State> = createSagaMiddleware()
  const store = createStore<State>(myReducer, initialState, batchEnhancer(sagaMiddleware))

  const output = {
    helloSagaCalled: 0,
    byeSagaCalled: 0,
    listenerCalled: 0,
  }

  store.subscribe(() => {
    output.listenerCalled++
  })

  function * sayHello () {
    while (true) {
      yield take('SayHello')
      output.helloSagaCalled++

      // Inside of saga, you can dispatch batch action
      yield put([
        {
          type: 'SayBye',
        },
        {
          type: 'SayBye',
        },
        {
          type: 'SayBye',
        },
      ])
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

  // Dispath single action
  store.dispatch({
    type: 'SayHello',
  })
  expect(output).toEqual({
    byeSagaCalled: 3,
    helloSagaCalled: 1,
    // Litener will be called twice
    // One from the above dispatch
    // One from saga
    listenerCalled: 2,
  })
  expect(store.getState().count).toEqual(1)

  // Dispatch batch action
  store.dispatch([
    {
      type: 'SayHello',
    },
    {
      type: 'SayHello',
    },
    {
      type: 'SayHello',
    },
  ])

  // Although our reducer and saga will be called 4 times,
  // the listener will be called only 2 times.
  expect(output).toEqual({
    // Now byeSaga will be called 12 times because helloSaga is called 4 times and each hello saga dispatch ByeAction 3 times. (4x3)
    byeSagaCalled: (1 + 3) * 3,
    helloSagaCalled: 4,
    // Single dispatch + side effect
    // Single Batched dispatch + side effect of each batched action.
    listenerCalled: 2 + 4,
  })
  expect(store.getState().count).toEqual(4)
})
