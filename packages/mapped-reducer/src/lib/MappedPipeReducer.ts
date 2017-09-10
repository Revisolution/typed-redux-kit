import { Action } from 'redux'
import {
  MappedReducerOptions,
  Reducer,
} from './types'
import { getActionTypes } from './util'

type ReducerArray<STATE, ACTION> = Reducer<STATE, ACTION>[]

export class MappedPipeReducer<STATE, ACTION_TYPE = any, ACTION extends Action = Action> {
  private initialState: STATE

  private reducerMap = new Map<ACTION_TYPE, ReducerArray<STATE, Action>>()

  constructor(opts: MappedReducerOptions<STATE> = {}) {
    this.initialState = opts.initialState
  }

  /**
   * Append reducer functions for the given key
   */
  public unshift = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[] | {[key: number]: SETTED_ACTION_TYPE} | {[key: string]: SETTED_ACTION_TYPE},
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = getActionTypes(actionTypeOrActionTypes)
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      const reducerArray: ReducerArray<STATE, SETTED_ACTION> = this.reducerMap.has(actionType)
        ? this.reducerMap.get(actionType)
        : []
      reducerArray.unshift(...reducers)
      this.reducerMap.set(actionType, reducerArray)
    })
    return this
  }
  public prepend = this.unshift

  /**
   * Append reducer functions for the given key
   */
  public push = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[] | {[key: number]: SETTED_ACTION_TYPE} | {[key: string]: SETTED_ACTION_TYPE},
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = getActionTypes(actionTypeOrActionTypes)
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      const reducerArray: ReducerArray<STATE, SETTED_ACTION> = this.reducerMap.has(actionType)
        ? this.reducerMap.get(actionType)
        : []
      reducerArray.push(...reducers)
      this.reducerMap.set(actionType, reducerArray)
    })
    return this
  }
  public append = this.push

  /**
   * Replace reducer functions for the given key
   */
  public set = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[] | {[key: number]: SETTED_ACTION_TYPE} | {[key: string]: SETTED_ACTION_TYPE},
    reducerOrReducers: Reducer<STATE, SETTED_ACTION> | ReducerArray<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = getActionTypes(actionTypeOrActionTypes)
    const reducers: ReducerArray<STATE, SETTED_ACTION> = Array.isArray(reducerOrReducers)
      ? reducerOrReducers
      : [reducerOrReducers]

    actionTypes.forEach((actionType) => {
      this.reducerMap.set(actionType, reducers)
    })
    return this
  }

  /**
   * Replace reducer functions for the given key
   */
  public delete = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[] | {[key: number]: SETTED_ACTION_TYPE} | {[key: string]: SETTED_ACTION_TYPE},
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = getActionTypes(actionTypeOrActionTypes)

    actionTypes.forEach((actionType) => {
      this.reducerMap.delete(actionType)
    })
    return this
  }

  public get = <SETTED_ACTION_TYPE extends ACTION_TYPE>(actionType: SETTED_ACTION_TYPE) => this.reducerMap.get(actionType)

  public reduce = (state: STATE = this.initialState, action: ACTION): STATE => {
    if (!this.reducerMap.has(action.type)) return state
    const reducers = this.reducerMap.get(action.type)
    return reducers.reduce((aState, reducer) => reducer(aState, action), state)
  }
}
