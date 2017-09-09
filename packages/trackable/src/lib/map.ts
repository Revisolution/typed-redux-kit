import {
  Trackable,
  isTrackable,
  setParentIfTrackable,
  initializeValue,
} from './trackable'
import {
  resolveEntryFromIterable,
  convertIterableToArray,
} from './util'

class TrackableMap<K extends string, V> extends Trackable<TrackableMap<K, V>> {
  private internalMap: Map<K, V>

  public get size (): number {
    return this.internalMap.size
  }

  constructor (entryIterableOrObject?: Iterable<[K, V]> | {[key: string]: V}) {
    super()
    if (entryIterableOrObject) {
      const entryIterable = resolveEntryFromIterable(entryIterableOrObject)

      this.internalMap = new Map()
      for (let [key, value] of entryIterable) {
        value = initializeValue(value, this)
        this.internalMap.set(key, value)
      }
    } else {
      this.internalMap = new Map()
    }
  }

  public [Symbol.iterator] () {
    return this.internalMap[Symbol.iterator]()
  }

  public onChildChange (child: V) {
    this.markAsChanged()
  }

  public has (key: K) {
    return this.internalMap.has(key)
  }

  public get (key: K, defaultValue?: V): V {
    if (!this.internalMap.has(key)) {
      return defaultValue
    }
    return this.internalMap.get(key)
  }

  public set (key: K, newValue: V) {
    const previousValue = this.internalMap.get(key)
    if (previousValue !== newValue) {
      this.markAsChanged()
      this.internalMap.set(key, newValue)
      setParentIfTrackable(newValue, this)
    }
    return this
  }

  public delete (key: K) {
    if (this.internalMap.has(key)) {
      this.markAsChanged()
      this.internalMap.delete(key)
    }
    return this
  }

  public update (key: K, mutator: (value: V) => V, defaultValue?: V) {
    const value = this.get(key, defaultValue)
    this.set(key, mutator(value))
    return this
  }

  public merge (partial: Iterable<[K, V]> | {[key: string]: V}) {
    const entries = resolveEntryFromIterable(partial)
    for (const [key, value] of entries) {
      this.set(key, value)
    }
    return this
  }

  public clear () {
    if (this.internalMap.size > 0) {
      this.internalMap = new Map()
      this.markAsChanged()
    }
  }

  public entries () {
    return this.internalMap.entries()
  }

  public toEntryArray () {
    return convertIterableToArray(this.entries())
  }

  public keys () {
    return this.internalMap.keys()
  }

  public toKeyArray () {
    return convertIterableToArray(this.keys())
  }

  public values () {
    return this.internalMap.values()
  }

  public toValueArray () {
    return convertIterableToArray(this.values())
  }

  public mapToArray <R>(callback: (item: V, index: K) => R): R[] {
    const array = []
    for (const [key, value] of this.internalMap.entries()) {
      array.push(callback(value, key))
    }
    return array
  }

  public map <R>(callback: (item: V, index: K) => R): TrackableMap<K, R> {
    const newMap: TrackableMap<K, R> = new TrackableMap()
    for (const [key, value] of this.internalMap.entries()) {
      newMap.set(key, callback(value, key))
    }
    newMap.$trackable.isChanged = false
    return newMap
  }

  public filter (callback: (item: V, index: K) => boolean): TrackableMap<K, V> {
    const newMap: TrackableMap<K, V> = new TrackableMap()
    for (const [key, value] of this.internalMap.entries()) {
      if (callback(value, key)) {
        newMap.set(key, value)
      }
    }
    newMap.$trackable.isChanged = false
    return newMap
  }

  public clone () {
    return new TrackableMap<K, V>(this)
  }

  public toJS (shallow: boolean = false) {
    const pureObject: {[key: string]: V} = {}
    for (const [key, value] of this) {
      pureObject[key] = !shallow && isTrackable(value)
        ? (value as any as Trackable<any>).toJS()
        : value
    }

    return pureObject
  }
}

export default TrackableMap
