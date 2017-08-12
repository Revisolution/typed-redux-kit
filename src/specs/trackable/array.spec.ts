import TrackableArray from '../../lib/trackable/array'

describe('TrackableArray', () => {
  describe('constructor', () => {
    it('converts from array', () => {
      const arr = TrackableArray<number>([1])

      expect(arr[0]).toBe(1)
      expect(arr.$trackable.isChanged).toBe(false)
    })
  })

  describe('set', () => {
    it('updates data and mark itself as changed', () => {
      const arr = TrackableArray<number>([1])

      arr[0] = 2

      expect(arr[0]).toBe(2)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childArr = TrackableArray<number>([1])
      const arr = TrackableArray<number[]>([
        childArr,
      ])

      childArr[0] = 2

      expect(arr.$trackable.isChanged).toBe(true)
    })
  })

  describe('push', () => {
    it('pushes value', () => {
      const arr = TrackableArray<number>([1])

      const length = arr.push(2)

      expect(length).toBe(2)
      expect(arr[1]).toBe(2)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('pushes multiple values', () => {
      const arr = TrackableArray<number>([1])

      const length = arr.push(2, 3)

      expect(length).toBe(3)
      expect(arr[1]).toBe(2)
      expect(arr[2]).toBe(3)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childArr = TrackableArray<number>([1])
      const arr = TrackableArray<number[]>([
        childArr,
      ])

      childArr.push(2)

      expect(arr.$trackable.isChanged).toBe(true)
    })
  })

  describe('unshift', () => {
    it('unshifts value', () => {
      const arr = TrackableArray<number>([1])

      const length = arr.unshift(0)

      expect(length).toBe(2)
      expect(arr[0]).toBe(0)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('unshifts multiple values', () => {
      const arr = TrackableArray<number>([1])

      const length = arr.unshift(-1, 0)

      expect(length).toBe(3)
      expect(arr[0]).toBe(-1)
      expect(arr[1]).toBe(0)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childArr = TrackableArray<number>([1])
      const arr = TrackableArray<number[]>([
        childArr,
      ])

      childArr.unshift(0)

      expect(arr.$trackable.isChanged).toBe(true)
    })
  })

  describe('pop', () => {
    it('pops a value', () => {
      const arr = TrackableArray<number>([1, 2])

      const value = arr.pop()

      expect(value).toBe(2)
      expect(arr[0]).toBe(1)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childArr = TrackableArray<number>([1])
      const arr = TrackableArray<number[]>([
        childArr,
      ])

      childArr.pop()

      expect(arr.$trackable.isChanged).toBe(true)
    })
  })

  describe('shift', () => {
    it('shifts a value', () => {
      const arr = TrackableArray<number>([1, 2])

      const value = arr.shift()

      expect(value).toBe(1)
      expect(arr[0]).toBe(2)
      expect(arr.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childArr = TrackableArray<number>([1])
      const arr = TrackableArray<number[]>([
        childArr,
      ])

      childArr.shift()

      expect(arr.$trackable.isChanged).toBe(true)
    })
  })

  describe('slice', () => {
    it('returns a clean array', () => {
      const arr = TrackableArray<number>([1])

      const newArr = arr.slice()

      expect(Array.isArray(newArr)).toBe(true)
      expect(newArr[0]).toBe(1)
    })
  })

  describe('clone', () => {
    it('returns a clean array', () => {
      const arr = TrackableArray<number>([1])
      arr[0] = 2

      const newArr = arr.clone()

      expect(newArr[0]).toBe(2)
      expect(newArr.$trackable.isChanged).toBe(false)
    })
  })

  describe('reserveArrayBuffer', () => {
    it('reserves more buffer on demand', () => {
      const hugeArray = Array.from({length: 1001}).map((v, k) => k)
      const arr = TrackableArray<number>(hugeArray)

      expect(arr[1000]).toBe(1000)
    })
  })
})
