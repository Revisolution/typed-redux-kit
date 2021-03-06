import * as Redux from 'redux'
import {
  trackEnhancer,
  TrackableMap,
  TrackableRecord,
} from '../lib'

test('it works', () => {
  const CountRecord = TrackableRecord({
    count: 0,
  })
  type CountRecord = TrackableRecord<{
    count: number
  }>
  type State = TrackableMap<string, CountRecord>
  const defaultChildState = CountRecord({
    count: 0,
  })
  const defaultState: State = new TrackableMap({
    a: defaultChildState,
  })

  const myReducer = (state: State = defaultState, action: Redux.Action) => {
    if (action.type === 'add') {
      state.get('a').count++
    }
    return state
  }
  const store = Redux.createStore(myReducer, trackEnhancer)

  store.dispatch({
    type: 'dummy',
  })

  const firstReducedState = store.getState()
  expect(firstReducedState.get('a').count).toBe(0)
  expect(firstReducedState).toBe(defaultState)

  store.dispatch({
    type: 'add',
  })

  const secondReducedState = store.getState()
  expect(secondReducedState.get('a').count).toBe(1)
  expect(secondReducedState).not.toBe(defaultState)
})
