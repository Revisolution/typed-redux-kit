import './polyfill'
import {
  Trackable,
  isTrackable,
  setParentIfTrackable,
  initializeValue,
} from './trackable'

class TrackableMap<K extends string, V> extends Trackable<TrackableMap<K, V>> {
  private internalMap: Map<K, V>

  constructor (entryIterableOrObject?: Iterable<[K, V]> | {[key: string]: V}) {
    super()
    if (entryIterableOrObject) {
      const entryIterable: Iterable<[K, V]> = !!(entryIterableOrObject as Iterable<[K, V]>)[Symbol.iterator]
        ? (entryIterableOrObject as Iterable<[K, V]>)
        : Object.entries(entryIterableOrObject) as Array<[K, V]>

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
