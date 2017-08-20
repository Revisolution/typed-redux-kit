import TrackableMap from '../../lib/trackable/map'

describe('TrackedMap', () => {
  describe('constructor', () => {
    it('constructs with object', () => {
      const tango = new TrackableMap({
        a: 1,
      })

      expect(tango.get('a')).toBe(1)
    })

    it('constructs with entry array', () => {
      const tango = new TrackableMap([['a', 1]])

      expect(tango.get('a')).toBe(1)
    })

    it('constructs with entry iterable', () => {
      const tango = new TrackableMap(new Map().set('a', 1))

      expect(tango.get('a')).toBe(1)
    })

    it('set parent to children with tracked interface', () => {
      const childTango = new TrackableMap()
      const tango = new TrackableMap({
        a: childTango,
      })

      expect(childTango.$trackable.parent).toBe(tango)
    })
  })

  describe('size', () => {
    it('presents size of map', () => {
      const tango = new TrackableMap([['a', 1]])

      expect(tango.size).toBe(1)
    })
  })

  describe('has', () => {
    it('check if map has a value for key', () => {
      const tango = new TrackableMap([['a', 1]])

      expect(tango.has('a')).toBe(true)
    })
  })

  describe('get', () => {
    it('return a value for key', () => {
      const tango = new TrackableMap([['a', 1]])

      expect(tango.get('a')).toBe(1)
    })
  })

  describe('set', () => {
    it('sets a new value', () => {
      const tango = new TrackableMap()

      tango.set('a', 1)

      expect(tango.get('a')).toBe(1)
    })

    it('sets parent to a new value if the new value is trackable', () => {
      const childTango = new TrackableMap()
      const tango = new TrackableMap()

      tango.set('a', childTango)

      expect(childTango.$trackable.parent).toBe(tango)
    })
  })

  describe('$trackable.isChanged', () => {
    it('is not changed just after instantiate', () => {
      const tango = new TrackableMap()

      expect(tango.$trackable.isChanged).toBe(false)
    })

    it('marks as changed itself after data set', () => {
      const tango = new TrackableMap()

      tango.set('a', 1)

      expect(tango.$trackable.isChanged).toBe(true)
    })

    it('is marked as changed when its children changed', () => {
      const childTango = new TrackableMap({
        b: 2,
      })
      const tango = new TrackableMap({
        a: childTango,
      })

      childTango.set('b', 3)

      expect(childTango.get('b')).toBe(3)
      expect(childTango.$trackable.isChanged).toBe(true)
      expect(tango.$trackable.isChanged).toBe(true)
    })
  })

  describe('delete', () => {
    it('deletes a data by key', () => {
      const tango = new TrackableMap([['a', 1]])

      tango.delete('a')

      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.get('a')).toBeUndefined()
    })
  })

  describe('update', () => {
    it('updates a data with mutator', () => {
      const tango = new TrackableMap([['a', 1]])

      tango.update('a', (str) => str + str)

      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.get('a')).toBe(2)
    })
  })

  describe('merge', () => {
    it('merges with key-value object', () => {
      const tango = new TrackableMap<string, number>([['a', 1]])

      tango.merge({
        a: 2,
        b: 3,
      })

      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.get('a')).toBe(2)
      expect(tango.get('b')).toBe(3)
    })

    it('merges with entry array', () => {
      const tango = new TrackableMap<string, number>([['a', 1]])

      tango.merge([
        ['a', 2],
        ['b', 3],
      ])

      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.get('a')).toBe(2)
      expect(tango.get('b')).toBe(3)
    })

    it('merges with key-value object', () => {
      const tango = new TrackableMap<string, number>([['a', 1]])

      tango.merge(new Map([
        ['a', 2],
        ['b', 3],
      ]))

      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.get('a')).toBe(2)
      expect(tango.get('b')).toBe(3)
    })
  })

  describe('clear', () => {
    it('clears all value', () => {
      const tango = new TrackableMap([['a', 1]])

      tango.clear()

      expect(tango.$trackable.isChanged).toBe(true)
      expect(tango.get('a')).toBeUndefined()
    })

    it('doesnt mark if nothing changed', () => {
      const tango = new TrackableMap([])

      tango.clear()

      expect(tango.$trackable.isChanged).toBe(false)
    })
  })

  describe('entries', () => {
    it('returns iterator of entries, which is key/value array', () => {
      const tango = new TrackableMap([['a', 1], ['b', 2]])

      const entries = tango.entries()

      expect(entries.next().value).toEqual(['a', 1])
      expect(entries.next().value).toEqual(['b', 2])
    })
  })

  describe('keys', () => {
    it('returns iterator of keys', () => {
      const tango = new TrackableMap([['a', 1], ['b', 2]])

      const entries = tango.keys()

      expect(entries.next().value).toBe('a')
      expect(entries.next().value).toBe('b')
    })
  })

  describe('values', () => {
    it('returns iterator of values', () => {
      const tango = new TrackableMap([['a', 1], ['b', 2]])

      const entries = tango.values()

      expect(entries.next().value).toBe(1)
      expect(entries.next().value).toBe(2)
    })
  })

  describe('map', () => {
    it('returns remapped map', () => {
      const tango = new TrackableMap([['a', 1], ['b', 2]])

      const mappedArray = tango.map((value, key) => key + value)

      expect(mappedArray.get('a')).toBe('a1')
      expect(mappedArray.get('b')).toBe('b2')
    })
  })

  describe('mapToArray', () => {
    it('returns mapped array', () => {
      const tango = new TrackableMap([['a', 1], ['b', 2]])

      const mappedArray = tango.mapToArray((value, key) => key + value)

      expect(mappedArray[0]).toBe('a1')
      expect(mappedArray[1]).toBe('b2')
    })
  })

  describe('filter', () => {
    it('returns filtered array', () => {
      const tango = new TrackableMap([['a', 1], ['b', 2]])

      const mappedArray = tango.filter((value) => value === 1)

      expect(mappedArray.get('a')).toBe(1)
      expect(mappedArray.get('b')).toBeUndefined()
    })
  })

  describe('clone', () => {
    it('clones and return clean instance with same value', () => {
      const tango = new TrackableMap()
      tango.set('a', 1)

      const clonedTango = tango.clone()

      expect(clonedTango.get('a')).toBe(1)
      expect(clonedTango.$trackable.isChanged).toBe(false)
    })

    it('clones and return clean instance with same value', () => {
      const childTango = new TrackableMap({
        b: 2,
      })
      const tango = new TrackableMap({
        a: childTango,
      })
      childTango.set('b', 3)

      const clonedTango = tango.clone()

      expect(clonedTango.$trackable.isChanged).toBe(false)
      const childOfClonedTango = clonedTango.get('a')
      expect(childOfClonedTango.$trackable.isChanged).toBe(false)
      expect(childOfClonedTango.get('b')).toBe(3)
    })
  })

  describe('toJS', () => {
    it('returns pure object', () => {
      const tango = new TrackableMap({
        a: 1,
      })

      expect(tango.toJS()).toEqual({
        a: 1,
      })
    })

    it('resolves nested tracked too', () => {
      const childTango = new TrackableMap({
        b: 2,
      })
      const tango = new TrackableMap({
        a: childTango,
      })

      expect(tango.toJS()).toEqual({
        a: {
          b: 2,
        },
      })
    })

    it('resolves shallowly if got true', () => {
      const childTango = new TrackableMap({
        b: 2,
      })
      const tango = new TrackableMap({
        a: childTango,
      })

      expect(tango.toJS(true)).toEqual({
        a: childTango,
      })
    })
  })
})
