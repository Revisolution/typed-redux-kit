import * as Redux from 'redux'

export interface PureAction <ACTION_TYPE> extends Redux.Action {
  readonly type: ACTION_TYPE
}

export interface PayloadAction <ACTION_TYPE, PAYLOAD> extends Redux.Action {
  readonly type: ACTION_TYPE
  readonly payload: PAYLOAD
}

export type Action = PureAction<any> | PayloadAction<any, any>

export interface MappedReducerOptions<S> {
  initialState?: S
}
export type Reducer<STATE, ACTION> = (state: STATE, action: ACTION) => STATE
