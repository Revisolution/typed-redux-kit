import {
  Trackable,
  isTrackable,
  setParentIfTrackable,
  initializeValue,
} from './trackable'
import {
  resolveEntryFromIterable,
  getEntries,
} from './util'

export type TrackableRecord<T> = T & TrackableRecordClass<T>
export const TrackableRecord = <T extends {}>(defaultValue: T): (object?: Partial<T>) => TrackableRecord<T> => {
  class ExtendedTrackableRecord extends TrackableRecordClass<T> {
    public clone (): TrackableRecord<T> {
      return new ExtendedTrackableRecord(Object.assign({}, defaultValue, this.internalObject)) as TrackableRecord<T>
    }
  }

  const keys = Object.keys(defaultValue)
  keys.forEach(key => {
    Object.defineProperty(ExtendedTrackableRecord.prototype, key, {
      set (newValue) {
        this.set(key, newValue)
      },
      get () {
        return this.get(key)
      },
    })
  })

  return (object?: Partial<T>) => {
    const record = new ExtendedTrackableRecord(Object.assign({}, defaultValue, object))
    return record as TrackableRecord<T>
  }
}

export class TrackableRecordClass<T> extends Trackable<TrackableRecord<T>> {
  protected internalObject: T

  constructor (entryIterableOrObject?: Iterable<[keyof T, T[keyof T]]> | T) {
    super()
    if (entryIterableOrObject) {
      const entryIterable = resolveEntryFromIterable(entryIterableOrObject)

      this.internalObject = {} as T
      for (let [key, value] of entryIterable) {
        value = initializeValue(value, this)
        this.internalObject[key] = value as T[keyof T]
      }
    } else {
      this.internalObject = {} as T
    }
  }

  public [Symbol.iterator] () {
    const entries = getEntries(this.internalObject)
    return entries[Symbol.iterator]()
  }

  public onChildChange (child: any) {
    this.markAsChanged()
  }

  public get <K extends keyof T>(key: K, defaultValue?: T[K]): T[K] {
    if (this.internalObject[key] === undefined) return defaultValue
    return this.internalObject[key]
  }

  public set <K extends keyof T>(key: K, newValue: T[K]) {
    const previousValue = this.internalObject[key]
    if (previousValue !== newValue) {
      this.markAsChanged()
      this.internalObject[key] = newValue
      if (isTrackable(newValue)) {
        setParentIfTrackable(newValue, this)
      }
    }
    return this
  }

  public delete <K extends keyof T>(key: K) {
    if (this.internalObject[key] !== undefined) {
      this.markAsChanged()
      this.internalObject[key] = undefined
    }
    return this
  }

  public update <K extends keyof T>(key: K, mutator: (value: T[K]) => T[K]) {
    const value = this.get(key)
    this.set(key, mutator(value))
    return this
  }

  public merge <K extends keyof T>(partial: Iterable<[K, T[K]]> | Partial<T>) {
    const entries = resolveEntryFromIterable(partial)
    for (const [key, value] of entries) {
      this.set(key, value)
    }
    return this
  }

  public clone () {
    return new TrackableRecordClass(this.internalObject) as TrackableRecord<T>
  }

  public toJS <K extends keyof T>(shallow: boolean = false) {
    const pureObject: T = {} as T
    for (const [key, value] of this) {
      pureObject[key as K] = !shallow && isTrackable(value)
        ? value.toJS()
        : value
    }

    return pureObject
  }
}

export default TrackableRecord
