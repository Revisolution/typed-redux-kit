import { createStore } from 'redux'
import {
  MappedReducer,
  Reducer,
} from '../lib'

describe('MappedReducer', () => {
  describe('set', () => {
    it('sets a reducer', () => {
      // Given
      const reducer = new MappedReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state

      // When
      reducer
        .set(ActionType, subReducer)

      // Then
      expect(reducer.get(ActionType)).toEqual(subReducer)
    })

    it('deletes a reducer', () => {
      // Given
      const reducer = new MappedReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
        .delete(ActionType)

      // Then
      expect(reducer.get(ActionType)).toBeUndefined()
    })

    it('replace reducer', () => {
      // Given
      const reducer = new MappedReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
      .set(ActionType, subReducer2)

      // Then
      expect(reducer.get(ActionType)).toEqual(subReducer2)
    })
  })

  describe('reduce', () => {
    it('reduces', () => {
      // Given
      interface State {
        count: 0,
      }
      const initialState: State = {
        count: 0,
      }
      const reducer = new MappedReducer<State>()
      const ActionType = 'random action'
      const setReducer = (state: State, action: {
        type: typeof ActionType
        payload: number
      }) => ({
        ...state,
        count: action.payload,
      } as State)
      reducer
        .set(ActionType, setReducer)

      // When
      const newState = reducer.reduce(initialState, {
        type: ActionType,
        payload: 1,
      } as Redux.Action)

      // Then
      expect(newState.count).toBe(1)
    })
  })
})
