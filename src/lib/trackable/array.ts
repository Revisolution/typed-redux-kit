import './polyfill'
import {
  Trackable,
  isTrackable,
  initializeValue,
  setParentIfTrackable,
} from './trackable'

let OBSERVABLE_ARRAY_BUFFER_SIZE = 0

export type TrackableArray<V> = V[] & TrackableArrayClass<V>
export const TrackableArray = <V>(iterable?: Iterable<V>): TrackableArray<V> => {
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
        value = initializeValue(value, this)
        this.internalArray.push(value)
        index++
      }
      this.reserveArrayBufferOnDemand()
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
      setParentIfTrackable(newValue, this)
      this.reserveArrayBufferOnDemand()
    }
    return this
  }

  public push (...newValues: V[]) {
    if (newValues.length > 0) {
      this.internalArray.push(...newValues)
      this.markAsChanged()
      for (const newValue of newValues) {
        setParentIfTrackable(newValue, this)
      }
      this.reserveArrayBufferOnDemand()
    }
    return this.internalArray.length
  }

  public pop () {
    let value: V
    if (this.internalArray.length > 0) {
      value = this.internalArray.pop()
      this.markAsChanged()
      this.reserveArrayBufferOnDemand()
    }
    return value
  }

  public unshift (...newValues: V[]) {
    if (newValues.length > 0) {
      this.internalArray.unshift(...newValues)
      this.markAsChanged()
      for (const newValue of newValues) {
        setParentIfTrackable(newValue, this)
      }
      this.reserveArrayBufferOnDemand()
    }
    return this.internalArray.length
  }

  public shift () {
    let value: V
    if (this.internalArray.length > 0) {
      value = this.internalArray.shift()
      this.markAsChanged()
      this.reserveArrayBufferOnDemand()
    }
    return value
  }

  public slice (start?: number, end?: number) {
    return this.internalArray.slice(start, end)
  }

  public clone () {
    return TrackableArray(this.internalArray)
  }

  public toJS (shallow: boolean = false) {
    const pureArray: V[] = []
    for (let [index, value] of this) {
      value = !shallow && isTrackable(value)
        ? (value as any as Trackable<any>).toJS()
        : value
      pureArray.push(value)
    }

    return pureArray
  }

  private reserveArrayBufferOnDemand () {
    if (this.internalArray.length > OBSERVABLE_ARRAY_BUFFER_SIZE) {
      reserveArrayBuffer(this.internalArray.length)
    }
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
