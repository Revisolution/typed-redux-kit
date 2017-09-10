import { createStore } from 'redux'
import {
  MappedPipeReducer,
  Reducer,
} from '../lib'

describe('MappedPipeReducer', () => {
  describe('set', () => {
    it('sets a reducer', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state

      // When
      reducer
        .set(ActionType, subReducer)

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer])
    })

    it('sets reducers', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state

      // When
      reducer
        .set(ActionType, [subReducer, subReducer2])

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer, subReducer2])
    })

    it('replace reducer', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
      .set(ActionType, subReducer2)

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer2])
    })
  })

  describe('prepend', () => {
    it('prepend a reducer', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
        .prepend(ActionType, subReducer2)

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer2, subReducer])
    })

    it('prepend reducers', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state
      const subReducer3 = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
        .prepend(ActionType, [subReducer2, subReducer3])

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer2, subReducer3, subReducer])
    })
  })

  describe('append', () => {
    it('append a reducer', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
        .append(ActionType, subReducer2)

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer, subReducer2])
    })

    it('append reducers', () => {
      // Given
      const reducer = new MappedPipeReducer()
      const ActionType = 'random action'
      const subReducer = <S>(state: S) => state
      const subReducer2 = <S>(state: S) => state
      const subReducer3 = <S>(state: S) => state
      reducer
        .set(ActionType, subReducer)

      // When
      reducer
        .append(ActionType, [subReducer2, subReducer3])

      // Then
      expect(reducer.get(ActionType)).toEqual([subReducer, subReducer2, subReducer3])
    })
  })

  describe('delete', () => {
    it('deletes reducer', () => {
      // Given
      const reducer = new MappedPipeReducer()
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
      const reducer = new MappedPipeReducer<State>()
      const ActionType = 'random action'
      const setReducer = (state: State, action: {
        type: typeof ActionType
        payload: number
      }) => ({
        ...state,
        count: action.payload,
      } as State)
      const multiflyReducer = (state: State) => ({
        ...state,
        count: state.count * 2,
      } as State)
      reducer
        .set(ActionType, [setReducer, multiflyReducer])

      // When
      const newState = reducer.reduce(initialState, {
        type: ActionType,
        payload: 1,
      } as Redux.Action)

      // Then
      // Set count to 1 and multify by 2 = 2
      expect(newState.count).toBe(2)
    })
  })
})
