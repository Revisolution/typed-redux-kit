import {
  Action,
  PayloadAction,
  PureAction,
} from './types'

export function createActionCreator <ACTION extends PayloadAction<ACTION['type'], ACTION['payload']>>(type: ACTION['type']): (payload: ACTION['payload']) => ACTION
export function createActionCreator <ACTION extends PureAction<ACTION['type']>>(type: ACTION['type']): () => ACTION
export function createActionCreator <ACTION extends {type: any, payload?: any}>(type: ACTION['type']) {
  return (payload: ACTION['payload']) => (
    payload == null
      ? ({
        type,
      } as ACTION)
      :  ({
        type,
        payload,
      } as ACTION)
  )
}
