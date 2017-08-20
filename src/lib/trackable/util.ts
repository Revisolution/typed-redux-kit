import './polyfill'

export const getEntries = Object.entries

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
