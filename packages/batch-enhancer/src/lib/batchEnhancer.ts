import * as Redux from 'redux'
import * as ReduxSaga from 'redux-saga'
import * as ReduxSagaEffects from 'redux-saga/effects'

declare module 'redux' {
  export interface Dispatch<S> {
    <A extends Redux.Action>(asyncAction: A | A[]): A
  }
}

declare module 'redux-saga/effects' {
  export interface Put {
    <A extends Redux.Action>(action: A[]): ReduxSagaEffects.PutEffect<A>
    resolve<A extends Redux.Action>(action: A[]): ReduxSagaEffects.PutEffect<A>
  }
}

const BatchActionType = '@@typed-redux/batched-actions'

interface BatchAction extends Redux.Action {
  type: typeof BatchActionType
  actions: Redux.Action[]
}

const batchable = <S, A extends Redux.Action>(reducer: (state: S, action: A | BatchAction) => S) => {
  return (state: S, action: A | BatchAction) => {
    if (action.type === BatchActionType) {
      return (action as BatchAction).actions.reduce(reducer, state)
    }
    return reducer(state, action)
  }
}

export const batchEnhancer = (sagaMiddleware?: ReduxSaga.SagaMiddleware<any>): Redux.GenericStoreEnhancer => <S>(createStore: Redux.StoreEnhancerStoreCreator<S>): Redux.StoreEnhancerStoreCreator<S> => (reducer, preloadedState) => {
  const store = createStore(batchable(reducer), preloadedState)

  let sagaDispatcher: Redux.Dispatch<S> = () => {
    return
  }

  const batchDispatcher: Redux.Dispatch<any> = <A extends Redux.Action>(actionOrActions: A | A[]) => {
    let action: Redux.Action
    if (Array.isArray(actionOrActions)) {
      actionOrActions.forEach(sagaDispatcher)
      action = {
        type: BatchActionType,
        actions: actionOrActions,
      } as BatchAction
    } else {
      action = actionOrActions as Redux.Action
      sagaDispatcher(action)
    }
    return store.dispatch(action)
  }

  if (sagaMiddleware) {
    sagaDispatcher = sagaMiddleware({
      getState: store.getState,
      // This dispatcher will be used by `put` effect of saga
      dispatch: batchDispatcher,
    })((a: Redux.Action) => a)
  }

  // Replace dispatch with our one
  return {
    ...store,
    dispatch: batchDispatcher,
  }
}
