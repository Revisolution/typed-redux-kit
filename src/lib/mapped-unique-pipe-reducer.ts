import {
  Action,
  MappedReducerOptions,
  Reducer,
} from './types'

type ReducerArray<STATE, ACTION> = Reducer<STATE, ACTION>[]
type ReducerSet<STATE, ACTION> = Set<Reducer<STATE, ACTION>>
/**
 * Almost same to MappedPipedReducer except using Set instead Array to hold reducers
 * By using Set, we can ensure our reducer is set ONLY ONCE.
 */
export class MappedUniquePipeReducer<STATE, ACTION_TYPE = any, ACTION extends Action = Action> {
  private initialState: STATE

  private reducerMap = new Map<ACTION_TYPE, ReducerSet<STATE, Action>>()

  constructor(opts: MappedReducerOptions<STATE> = {}) {
    this.initialState = opts.initialState
  }

  /**
   * Append reducer functions for the given key
   */
  public add = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[],
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = Array.isArray(actionTypeOrActionTypes)
      ? actionTypeOrActionTypes
      : [actionTypeOrActionTypes]
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      const reducerSet: ReducerSet<STATE, SETTED_ACTION> = this.reducerMap.has(actionType)
        ? this.reducerMap.get(actionType)
        : new Set()
      reducers.forEach((reducer) => reducerSet.add(reducer))
      this.reducerMap.set(actionType, reducerSet)
    })
    return this
  }

  /**
   * Replace reducer functions for the given key
   */
  public set = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[],
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = Array.isArray(actionTypeOrActionTypes)
      ? actionTypeOrActionTypes
      : [actionTypeOrActionTypes]
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      this.reducerMap.set(actionType, new Set(reducers))
    })
    return this
  }

  public get = <SETTED_ACTION_TYPE extends ACTION_TYPE>(actionType: SETTED_ACTION_TYPE) => Array.from(this.reducerMap.get(actionType))

  public reduce = (state: STATE = this.initialState, action: ACTION): STATE => {
    if (!this.reducerMap.has(action.type)) return state
    const reducers = Array.from(this.reducerMap.get(action.type))
    return reducers.reduce((aState, reducer) => reducer(aState, action), state)
  }
}
