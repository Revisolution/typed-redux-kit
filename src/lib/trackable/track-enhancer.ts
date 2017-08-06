import { Trackable } from './trackable'
import * as Redux from 'redux'

const terminalProcessor = <S>(reducer: Redux.Reducer<S>) => {
  return (state: S, action: Redux.Action) => {
    const reducedState = reducer(state, action)

    return (reducedState instanceof Trackable) && (reducedState as Trackable<any>).$$isChanged
      ? reducedState.clone()
      : reducedState
  }
}

export const trackEnhancer: Redux.GenericStoreEnhancer = <S>(createStore: Redux.StoreEnhancerStoreCreator<S>): Redux.StoreEnhancerStoreCreator<S> => (reducer, preloadedState) => {
  return createStore(terminalProcessor(reducer), preloadedState)
}
