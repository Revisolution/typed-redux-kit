import { createStore } from 'redux'
import {
  createActionCreator,
  MappedReducer,
  PayloadAction,
  PureAction,
  Reducer,
} from '../lib'

enum ActionTypes {
  Plus = 'test_Plus',
  Set = 'test_Set',
  SayHello = 'test_SayHello',
  SayBye = 'test_SayBye',
}

namespace Actions {
  // We recommends to use interface rather than type literal to get better error message(Too verbose)
  // Type Literal:
  // export type PlusAction = PureAction<ActionTypes.Plus>
  export interface PlusAction extends PureAction<ActionTypes.Plus> {}
  // But, we use type literal when giving payload. By this way, we can have helpful hint for payload.
  export interface SetAction extends PayloadAction<ActionTypes.Set, {
    count: number
  }> {}
  export interface SayHelloAction extends PureAction<ActionTypes.SayHello> {}
  export interface SayByeAction extends PureAction<ActionTypes.SayBye> {}

  /**
   * Interface VS Type Literal
   *
   * When figure out which action is needed for reducer,
   * We probably want to see name of Type rather than the structure of PureAction or PayloadAction
   * => So, if we use interface, we could get the name of interface directly
   * (e.g. `Actions.SetAction` rather than `PureAction<ActionTypes.Set, {count: number}>`)
   *
   * But, when we use actionCreator, we probably want to know which members must be given.
   * => So, if we use type literal, we could figure out the members we should give easily.
   * (e.g.
   * ```
   * (property) set: (payload: {
   *   count: number;
   * }) => Actions.SetAction
   * ```
   * Rather than below,
   * ```
   * (property) set: (payload: SetPayload) => Actions.SetAction
   * ```
   * To know members of SetPayload interface, we have to use `Go to definition`.
   * )
   */
}

type SayAction = Actions.SayHelloAction
  | Actions.SayByeAction

const ActionCreators = {
  plus: createActionCreator<Actions.PlusAction>(ActionTypes.Plus),
  set: createActionCreator<Actions.SetAction>(ActionTypes.Set),
  sayHello: createActionCreator<Actions.SayHelloAction>(ActionTypes.SayHello),
  sayBye: createActionCreator<Actions.SayByeAction>(ActionTypes.SayBye),
}

interface State {
  count: number
  message: string
}

const initialState: State = {
  count: 0,
  message: 'No message!',
}

// You needed to set types for arguments of reducer function
const plusSubReducer = (state: State, action: Actions.PlusAction) => ({
  ...state,
  count: state.count + 1,
})

// You can also use `Reducer<STATE, ACTION>` interface (Recommended)
const setSubReducer: Reducer<State, Actions.SetAction> = (state, action) => ({
  ...state,
  ...action.payload,
})

// Also, you can set multiple actions(union)
const sayReducer: Reducer<State, SayAction> = (state, action) => ({
  ...state,
  message: action.type === ActionTypes.SayHello
    ? 'Hello!'
    : 'Bye!',
})

// Dummy Action and Reducer to cause Type error
interface RandomAction {
  type: 'UNWELCOMMED'
  payload: {
    message: string
  }
}
const randomReducer: Reducer<State, RandomAction> = (state, action) => state

/**
 * ActionTypes is optional
 * But, we can use it to prevent from setting wrong actions
 */
const reducer = new MappedReducer<State, ActionTypes>()

// reducer#set is chainable
reducer
  .set(ActionTypes.Plus, plusSubReducer)
  .set(ActionTypes.Set, setSubReducer)
  .set([
    ActionTypes.SayHello,
    ActionTypes.SayBye,
  ], sayReducer)

  /**
   * The below usages of `reducer#set` are intended to cause Type errors
   */

  // Wrong ActionType and Sub Reducer combination
  // .set(ActionTypes.Set, plusSubReducer)
  // .set(ActionTypes.Plus, setSubReducer)

  // Invalid Action Types
  // .set([
  //   'UNWELCOMMED'
  // ], sayReducer)
  // .set('UNWELCOMMED', sayReducer)

const store = createStore(reducer.reduce, initialState)

test('MappedReducer', () => {
  // Check if the reducer is set properly
  expect(reducer.get(ActionTypes.Plus)).toEqual(plusSubReducer)

  const plusAction = ActionCreators.plus()
  store.dispatch(plusAction)

  const firstReducedState = store.getState()
  expect(firstReducedState).toEqual({
    count: 1,
    message: 'No message!',
  })

  const setAction = ActionCreators.set({
    count: 0,
  })
  store.dispatch(setAction)

  const secondReducedState = store.getState()
  expect(secondReducedState).toEqual({
    count: 0,
    message: 'No message!',
  })

  const sayHelloAction = ActionCreators.sayHello()
  store.dispatch(sayHelloAction)

  const thirdReducedState = store.getState()
  expect(thirdReducedState).toEqual({
    count: 0,
    message: 'Hello!',
  })

  const sayByeAction = ActionCreators.sayBye()
  store.dispatch(sayByeAction)

  const forthReducedState = store.getState()
  expect(forthReducedState).toEqual({
    count: 0,
    message: 'Bye!',
  })
})
