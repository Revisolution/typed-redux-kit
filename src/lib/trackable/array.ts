import './polyfill'
import {
  Trackable
} from './trackable'

let OBSERVABLE_ARRAY_BUFFER_SIZE = 0

export type TrackableArray<V> = V[] & TrackableArrayClass<V>
export const TrackableArray = <V extends {}>(iterable?: Iterable<V>): TrackableArray<V> => {
  const record = new TrackableArrayClass(iterable)
  return record as TrackableArray<V>
}

class TrackableArrayClass<V> extends Trackable<TrackableArrayClass<V>> {
  private internalArray: V[]

  constructor (iterable?: Iterable<V>) {
    super()
    if (iterable && iterable[Symbol.iterator]) {
      this.internalArray = [] as V[]
      let index = 0
      for (let value of iterable) {
        if ((value as any).$$trackable) {
          (value as any).setParent(this)
          if ((value as any).$$isChanged) {
            value = (value as any).clone()
          }
        }
        this.internalArray.push(value)
        index++
      }
      if (this.internalArray.length > OBSERVABLE_ARRAY_BUFFER_SIZE) {
        reserveArrayBuffer(this.internalArray.length)
      }
    } else {
      this.internalArray = []
    }
  }

  public [Symbol.iterator] () {
    const entries = Object.entries(this.internalArray)
    return entries[Symbol.iterator]()
  }

  public onChildChange (child: any) {
    this.markAsChanged()
  }

  public get (index: number, defaultValue?: V): V {
    if (this.internalArray[index] === undefined) return defaultValue
    return this.internalArray[index]
  }

  public set (index: number, newValue: V) {
    const previousValue = this.internalArray[index]
    if (previousValue !== newValue) {
      this.markAsChanged()
      this.internalArray[index] = newValue
      if ((newValue as any).$$trackable) {
        (newValue as any).setParent(this)
      }
    }
    return this
  }

  public clone () {
    return TrackableArray(this.internalArray)
  }

  public toJS (shallow: boolean = false) {
    const pureArray: V[] = []
    for (let [index, value] of this) {
      value = !shallow && value.$$trackable
        ? value.toJS()
        : value
      pureArray.push(value)
    }

    return pureArray
  }
}

function createArrayBufferItem(index: number) {
  Object.defineProperty(TrackableArrayClass.prototype, '' + index, {
    enumerable: false,
    configurable: false,
    get () {
      return this.get(index)
    },
    set (value) {
      this.set(index, value)
    },
  })
}

function reserveArrayBuffer(max: number) {
  for (let index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max; index++) {
    createArrayBufferItem(index)
  }
  OBSERVABLE_ARRAY_BUFFER_SIZE = max
}

reserveArrayBuffer(1000)

export default TrackableArray
