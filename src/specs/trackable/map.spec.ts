import TrackableMap from '../../lib/trackable/map'

describe('TrackedMap', () => {
  describe('constructor', () => {
    it('constructs with object', () => {
      const tango = new TrackableMap({
        a: 'a',
      })

      expect(tango.get('a')).toBe('a')
    })

    it('constructs with entry array', () => {
      const tango = new TrackableMap([['a', 'a']])

      expect(tango.get('a')).toBe('a')
    })

    it('constructs with entry iterable', () => {
      const tango = new TrackableMap(new Map().set('a', 'a'))

      expect(tango.get('a')).toBe('a')
    })

    it('set parent to children with tracked interface', () => {
      const childTango = new TrackableMap()
      const tango = new TrackableMap({
        a: childTango,
      })

      expect(childTango.$$parent).toBe(tango)
    })
  })

  describe('set', () => {
    it('sets new value', () => {
      const tango = new TrackableMap()
      tango
        .set('a', 'a')

      expect(tango.get('a')).toBe('a')
    })

    it('sets parent to new value if new value is tracked', () => {
      const childTango = new TrackableMap()
      const tango = new TrackableMap()

      tango.set('a', childTango)

      expect(childTango.$$parent).toBe(tango)
    })
  })

  describe('$$isChanged', () => {
    it('is not changed just after instantiate', () => {
      const tango = new TrackableMap()

      expect(tango.$$isChanged).toBe(false)
    })

    it('marks as changed itself after data set', () => {
      const tango = new TrackableMap()

      tango.set('a', 'a')

      expect(tango.$$isChanged).toBe(true)
    })

    it('is marked as changed when its children changed', () => {
      const childTango = new TrackableMap({
        b: 'b',
      })
      const tango = new TrackableMap({
        a: childTango,
      })

      childTango.set('b', 'c')

      expect(childTango.get('b')).toBe('c')
      expect(childTango.$$isChanged).toBe(true)
      expect(tango.$$isChanged).toBe(true)
    })
  })

  describe('delete', () => {
    it('deletes a data by key', () => {
      const tango = new TrackableMap([['a', 'a']])

      tango.delete('a')

      expect(tango.$$isChanged).toBe(true)
      expect(tango.get('a')).toBeUndefined()
    })
  })

  describe('clone', () => {
    it('clones and return clean instance with same value', () => {
      const tango = new TrackableMap()
      tango.set('a', 'a')

      const clonedTango = tango.clone()

      expect(clonedTango.get('a')).toBe('a')
      expect(clonedTango.$$isChanged).toBe(false)
    })

    it('clones and return clean instance with same value', () => {
      const childTango = new TrackableMap({
        b: 'b',
      })
      const tango = new TrackableMap({
        a: childTango,
      })
      childTango.set('b', 'c')

      const clonedTango = tango.clone()

      expect(clonedTango.$$isChanged).toBe(false)
      const childOfClonedTango = clonedTango.get('a')
      expect(childOfClonedTango.$$isChanged).toBe(false)
      expect(childOfClonedTango.get('b')).toBe('c')
    })
  })

  describe('toJS', () => {
    it('returns pure object', () => {
      const tango = new TrackableMap({
        a: 'a',
      })

      expect(tango.toJS()).toEqual({
        a: 'a',
      })
    })

    it('resolves nested tracked too', () => {
      const childTango = new TrackableMap({
        b: 'b',
      })
      const tango = new TrackableMap({
        a: childTango,
      })

      expect(tango.toJS()).toEqual({
        a: {
          b: 'b',
        },
      })
    })

    it('resolves shallowly if got true', () => {
      const childTango = new TrackableMap({
        b: 'b',
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
