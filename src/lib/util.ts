import './polyfill'

export const getEntries = Object.entries
export const getValues = Object.values

export const resolveEntryIterable = <T, K extends keyof T>(entryIterableOrObject: Iterable<[K, T[K]]> | T) => {
  return !!(entryIterableOrObject as Iterable<[K, T[K]]>)[Symbol.iterator]
    ? (entryIterableOrObject as Iterable<[K, T[K]]>)
    : Object.entries(entryIterableOrObject) as Array<[K, T[K]]>
}

export const convertIterableToArray = <V>(iterable: Iterable<V>): V[] => {
  const array = []
  for (const item of iterable) {
    array.push(item)
  }
  return array
}

export function isPlainObject (value: any) {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export function getActionTypes <SETTED_ACTION_TYPE>(actionTypeOrActionTypes: SETTED_ACTION_TYPE | SETTED_ACTION_TYPE[] | {[key: number]: SETTED_ACTION_TYPE} | {[key: string]: SETTED_ACTION_TYPE}): SETTED_ACTION_TYPE[] {
  return Array.isArray(actionTypeOrActionTypes)
  ? actionTypeOrActionTypes
  : isPlainObject(actionTypeOrActionTypes)
  ? getValues(actionTypeOrActionTypes as object)
  : [actionTypeOrActionTypes]
}
