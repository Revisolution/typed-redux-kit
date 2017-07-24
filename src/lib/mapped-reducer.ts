import {
  Action,
  MappedReducerOptions,
  Reducer,
} from './types'

export class MappedReducer<STATE, ACTION_TYPE = any, ACTION extends Action = Action> {
  private initialState: STATE

  private reducerMap = new Map<ACTION_TYPE, Reducer<STATE, Action>>()

  constructor(opts: MappedReducerOptions<STATE> = {}) {
    this.initialState = opts.initialState
  }

  public set = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[],
    reducer: Reducer<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = Array.isArray(actionTypeOrActionTypes)
      ? actionTypeOrActionTypes
      : [actionTypeOrActionTypes]
    actionTypes.forEach((actionType) => {
      this.reducerMap.set(actionType, reducer)
    })
    return this
  }

  public get = <SETTED_ACTION_TYPE extends ACTION_TYPE>(actionType: SETTED_ACTION_TYPE) => this.reducerMap.get(actionType)

  public reduce = (state: STATE = this.initialState, action: ACTION): STATE => {
    if (!this.reducerMap.has(action.type)) return state
    return this.reducerMap.get(action.type)(state, action)
  }
}
