import TrackableArray from '../../lib/trackable/array'

describe('TrackableArray', () => {
  describe('constructor', () => {
    it('converts from tangoay', () => {
      const tango = TrackableArray<number>([1])

      expect(tango[0]).toBe(1)
      expect(tango.$trackable.isChanged).toBe(false)
    })
  })

  describe('length', () => {
    it('presents length of array', () => {
      const tango = TrackableArray<number>([1])

      expect(tango.length).toBe(1)
    })
  })

  describe('set', () => {
    it('updates data and mark itself as changed', () => {
      const tango = TrackableArray<number>([1])

      tango[0] = 2

      expect(tango[0]).toBe(2)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childTango = TrackableArray<number>([1])
      const tango = TrackableArray<number[]>([
        childTango,
      ])

      childTango[0] = 2

      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('push', () => {
    it('pushes value', () => {
      const tango = TrackableArray<number>([1])

      const length = tango.push(2)

      expect(length).toBe(2)
      expect(tango[1]).toBe(2)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('pushes multiple values', () => {
      const tango = TrackableArray<number>([1])

      const length = tango.push(2, 3)

      expect(length).toBe(3)
      expect(tango[1]).toBe(2)
      expect(tango[2]).toBe(3)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childTango = TrackableArray<number>([1])
      const tango = TrackableArray<number[]>([
        childTango,
      ])

      childTango.push(2)

      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('unshift', () => {
    it('unshifts value', () => {
      const tango = TrackableArray<number>([1])

      const length = tango.unshift(0)

      expect(length).toBe(2)
      expect(tango[0]).toBe(0)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('unshifts multiple values', () => {
      const tango = TrackableArray<number>([1])

      const length = tango.unshift(-1, 0)

      expect(length).toBe(3)
      expect(tango[0]).toBe(-1)
      expect(tango[1]).toBe(0)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childTango = TrackableArray<number>([1])
      const tango = TrackableArray<number[]>([
        childTango,
      ])

      childTango.unshift(0)

      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('pop', () => {
    it('pops a value', () => {
      const tango = TrackableArray<number>([1, 2])

      const value = tango.pop()

      expect(value).toBe(2)
      expect(tango[0]).toBe(1)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childTango = TrackableArray<number>([1])
      const tango = TrackableArray<number[]>([
        childTango,
      ])

      childTango.pop()

      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('shift', () => {
    it('shifts a value', () => {
      const tango = TrackableArray<number>([1, 2])

      const value = tango.shift()

      expect(value).toBe(1)
      expect(tango[0]).toBe(2)
      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('marks parent changed', () => {
      const childTango = TrackableArray<number>([1])
      const tango = TrackableArray<number[]>([
        childTango,
      ])

      childTango.shift()

      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('splice', () => {
    it('discards items', () => {
      const tango = TrackableArray<number>([1, 2, 3])

      const deleted = tango.splice(1, 1)

      expect(deleted).toEqual([2])
      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.slice()).toEqual([1, 3])
    })

    it('inserts items', () => {
      const tango = TrackableArray<number>([1, 2, 3])

      const deleted = tango.splice(1, 0, 1.25, 1.5, 1.75)

      expect(deleted).toEqual([])
      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.slice()).toEqual([1, 1.25, 1.5, 1.75, 2, 3])
    })

    it('marks parent changed', () => {
      const childTango = TrackableArray<number>([1])
      const tango = TrackableArray<number[]>([
        childTango,
      ])

      childTango.splice(0, 1)

      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('slice', () => {
    it('returns a clean array', () => {
      const tango = TrackableArray<number>([1])

      const newTango = tango.slice()

      expect(Array.isArray(newTango)).toBe(true)
      expect(newTango[0]).toBe(1)
    })
  })

  describe('clone', () => {
    it('returns a clean tangoay', () => {
      const tango = TrackableArray<number>([1])
      tango[0] = 2

      const newTango = tango.clone()

      expect(newTango[0]).toBe(2)
      expect(newTango.$trackable.isChanged).toBe(false)
    })
  })

  describe('reserveArrayBuffer', () => {
    it('reserves more buffer on demand', () => {
      const hugeArray = Array.from({length: 1001}).map((v, k) => k)
      const tango = TrackableArray<number>(hugeArray)

      expect(tango[1000]).toBe(1000)
    })
  })
})
