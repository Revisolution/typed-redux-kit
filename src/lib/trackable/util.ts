import './polyfill'

export const getEntries = Object.entries

export const resolveEntryIterable = <T>(entryIterableOrObject: Iterable<[keyof T, T[keyof T]]> | T) => {
  return !!(entryIterableOrObject as Iterable<[keyof T, T[keyof T]]>)[Symbol.iterator]
    ? (entryIterableOrObject as Iterable<[keyof T, T[keyof T]]>)
    : Object.entries(entryIterableOrObject) as Array<[keyof T, T[keyof T]]>
}
