import {
  Trackable,
  isTrackable,
  initializeValue,
  setParentIfTrackable,
} from './trackable'
import {
  getEntries
} from './util'

let OBSERVABLE_ARRAY_BUFFER_SIZE = 0

export type TrackableArray<V> = V[] & TrackableArrayClass<V>
export const TrackableArray = <V>(iterable?: Iterable<V>): TrackableArray<V> => {
  const record = new TrackableArrayClass(iterable)
  return record as TrackableArray<V>
}

export class TrackableArrayClass<V> extends Trackable<TrackableArrayClass<V>> {
  private internalArray: V[]

  public get length (): number {
    return this.internalArray.length
  }

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
    const entries = getEntries(this.internalArray)
    return entries[Symbol.iterator]()
  }

  /**
   * Modifier
   */

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

  public splice (start: number, deleteCount?: number, ...items: V[]) {
    for (const item of items) {
      setParentIfTrackable(item, this)
    }
    const deleted = this.internalArray.splice(start, deleteCount, ...items)
    if (deleteCount > 0 || items.length > 0) {
      this.markAsChanged()
      this.reserveArrayBufferOnDemand()
    }
    return deleted
  }

  public copyWithin (target: number, start?: number, end?: number) {
    if (target !== 0 || start !== 0) {
      this.internalArray.copyWithin(target, start, end)
      this.markAsChanged()
    }
    return this
  }

  public fill (value: V, start?: number, end?: number) {
    if (this.internalArray.length > 0) {
      setParentIfTrackable(value, this)
      this.internalArray.fill(value, start, end)
      this.markAsChanged()
    }
    return this
  }

  public reverse () {
    if (this.internalArray.length > 0) {
      this.internalArray.reverse()
      this.markAsChanged()
    }
    return this
  }

  public sort (compare?: (a: V, b: V) => number) {
    if (this.internalArray.length > 0) {
      this.internalArray.sort(compare)
      this.markAsChanged()
    }
    return this
  }

  /**
   * Selectors
   */

  public get (index: number, defaultValue?: V): V {
    if (this.internalArray[index] === undefined) return defaultValue
    return this.internalArray[index]
  }

  public slice (start?: number, end?: number) {
    return this.internalArray.slice(start, end)
  }

  public concat (...arrays: Array<TrackableArray<V>>) {
    return this.internalArray.concat(...arrays.map((array) => array.$trackable
      ? array.slice()
      : array,
    ))
  }

  public entries (): IterableIterator<[number, V]> {
    return this.internalArray.entries()
  }

  public every (callback: (value: V, index: number, array: V[]) => boolean, thisArg?: any): boolean {
    return this.internalArray.every(callback, thisArg)
  }

  public filter (callback: (value: V, index: number, array: V[]) => any, thisArg?: any): V[] {
    return this.internalArray.filter(callback, thisArg)
  }

  public find (predicate: (this: void, value: V, index: number, obj: Array<V>) => boolean): V | undefined
  public find <Z>(predicate: (this: Z, value: V, index: number, obj: Array<V>) => boolean, thisArg?: Z): V | undefined {
    return this.internalArray.find(predicate, thisArg)
  }

  public findIndex (predicate: (this: void, value: V, index: number, obj: Array<V>) => boolean): number
  public findIndex <Z>(predicate: (this: Z, value: V, index: number, obj: Array<V>) => boolean, thisArg?: Z): number {
    return this.internalArray.findIndex(predicate, thisArg)
  }

  public includes (searchElement: V, fromIndex?: number): boolean {
    return this.internalArray.includes(searchElement, fromIndex)
  }

  public indexOf (searchElement: V, fromIndex?: number): number {
    return this.internalArray.indexOf(searchElement, fromIndex)
  }

  public join (seperator?: string): string {
    return this.internalArray.join(seperator)
  }

  public keys (): IterableIterator<number> {
    return this.internalArray.keys()
  }

  public lastIndexOf (searchElement: V, fromIndex?: number): number {
    return this.internalArray.lastIndexOf(searchElement, fromIndex)
  }

  public map <U>(callback: (value: V, index: number, array: V[]) => U, thisArg?: any): U[] {
    return this.internalArray.map(callback, thisArg)
  }

  public reduce <U>(callback: (previousValue: U, currentValue: V, currentIndex: number, array: V[]) => U, initialValue?: U): U {
    return this.internalArray.reduce(callback, initialValue)
  }

  public reduceRight <U>(callback: (previousValue: U, currentValue: V, currentIndex: number, array: V[]) => U, initialValue?: U): U {
    return this.internalArray.reduceRight(callback, initialValue)
  }

  public some (callback: (value: V, index: number, array: V[]) => boolean, thisArg?: any): boolean {
    return this.internalArray.some(callback, thisArg)
  }

  public toLocaleString (): string {
    return this.internalArray.toLocaleString()
  }

  public toString (): string {
    return this.internalArray.toString()
  }

  public values (): IterableIterator<V> {
    return this.internalArray.values()
  }

  /**
   * Trackable Specifics
   */

  public onChildChange (child: any) {
    this.markAsChanged()
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
