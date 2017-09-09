import { Trackable } from './trackable'
import * as Redux from 'redux'

const terminalProcessor = <S>(reducer: Redux.Reducer<S>) => {
  return (state: S, action: Redux.Action): S => {
    const reducedState: Trackable<any> = reducer(state, action) as any

    return reducedState.$trackable && reducedState.$trackable.isChanged
      ? reducedState.clone()
      : reducedState
  }
}

export const trackEnhancer: Redux.GenericStoreEnhancer = <S>(createStore: Redux.StoreEnhancerStoreCreator<S>): Redux.StoreEnhancerStoreCreator<S> => (reducer, preloadedState) => {
  return createStore(terminalProcessor(reducer), preloadedState)
}
