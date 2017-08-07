import './polyfill'
import {
  Trackable
} from './trackable'

export type TrackableRecord<T> = T & TrackableRecordClass<T>
export const TrackableRecord = <T extends {}>(object: T): TrackableRecord<T> => {
  const record = new TrackableRecordClass(object)
  return record as TrackableRecord<T>
}

class TrackableRecordClass<T> extends Trackable<TrackableRecordClass<T>> {
  private internalObject: T

  constructor (entryIterableOrObject?: Iterable<[keyof T, T[keyof T]]> | T) {
    super()
    if (entryIterableOrObject) {
      const entryIterable: Iterable<[keyof T, T[keyof T]]> = !!(entryIterableOrObject as Iterable<[keyof T, T[keyof T]]>)[Symbol.iterator]
        ? (entryIterableOrObject as Iterable<[keyof T, T[keyof T]]>)
        : Object.entries(entryIterableOrObject) as Array<[keyof T, T[keyof T]]>

      this.internalObject = {} as T
      for (let [key, value] of entryIterable) {
        if ((value as any).$$trackable) {
          (value as any).setParent(this)
          if ((value as any).$$isChanged) {
            value = (value as any).clone()
          }
        }
        this.internalObject[key] = value
        Object.defineProperty(this, key, {
          set: (newValue) => {
            this.set(key, newValue)
          },
          get: () => {
            return this.get(key)
          },
        })
      }
    } else {
      this.internalObject = {} as T
    }
  }

  public [Symbol.iterator] () {
    const entries = Object.entries(this.internalObject)
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
      if ((newValue as any).$$trackable) {
        (newValue as any).setParent(this)
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

  public clone () {
    return TrackableRecord(this.internalObject)
  }

  public toJS <K extends keyof T>(shallow: boolean = false) {
    const pureObject: T = {} as T
    for (const [key, value] of this) {
      pureObject[key as K] = !shallow && value.$$trackable
        ? value.toJS()
        : value
    }

    return pureObject
  }
}

export default TrackableRecord
