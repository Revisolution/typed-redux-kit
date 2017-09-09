import { Action } from 'redux'
import {
  MappedReducerOptions,
  Reducer,
} from './types'
import { getActionTypes } from './util'

export class MappedReducer<STATE, ACTION_TYPE = any, ACTION extends Action = Action> {
  private initialState: STATE

  private reducerMap = new Map<ACTION_TYPE, Reducer<STATE, Action>>()

  /**
   * Instantiate MappedReducer
   *
   * The only option is initialState for now.
   *
   * @param {MappedReducerOptions<STATE>} [opts={}]
   * @memberof MappedReducer
   */
  constructor(opts: MappedReducerOptions<STATE> = {}) {
    this.initialState = opts.initialState
  }

  /**
   * Set a subreducer for the given action type(s)
   *
   * It takes a single action type and array/string enum of action types
   *
   * @memberof MappedReducer
   */
  public set = <SETTED_ACTION extends ACTION, SETTED_ACTION_TYPE extends SETTED_ACTION['type'] & ACTION_TYPE>(
    actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[] | {[key: number]: SETTED_ACTION_TYPE} | {[key: string]: SETTED_ACTION_TYPE},
    reducer: Reducer<STATE, SETTED_ACTION>,
  ) => {
    const actionTypes: SETTED_ACTION_TYPE[] = getActionTypes(actionTypeOrActionTypes)
    actionTypes.forEach((actionType) => {
      this.reducerMap.set(actionType, reducer)
    })
    return this
  }

  /**
   * Delete a subreducer for the given action type(s)
   *
   * It takes a single action type and array/string enum of action types
   *
   * @memberof MappedReducer
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
    return this.reducerMap.get(action.type)(state, action)
  }
}
