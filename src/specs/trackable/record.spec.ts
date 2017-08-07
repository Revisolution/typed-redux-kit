import {
  TrackableRecord,
  TrackableMap,
} from '../../lib/trackable'

describe('test', () => {
  describe('constructor', () => {
    it('returns trackable record', () => {
      const user = TrackableRecord({
        name: 'yolo',
      })

      expect(user.$$trackable).toBe(true)
      expect(user.$$isChanged).toBe(false)
      expect(user.name).toBe('yolo')
    })
  })

  describe('set', () => {
    it('sets data and is marked as changed', () => {
      const user = TrackableRecord({
        name: 'yolo',
      })

      user.name = 'test'

      expect(user.$$isChanged).toBe(true)
      expect(user.name).toBe('test')
    })

    it('marks as changed when child trackable map changed', () => {
      const user = TrackableRecord({
        name: 'yolo',
        map: new TrackableMap({
          a: 'a',
        }),
      })

      user.map.set('a', 'b')

      expect(user.map.$$isChanged).toBe(true)
      expect(user.map.get('a')).toBe('b')
      expect(user.$$isChanged).toBe(true)
    })

    it('marks as changed when child trackable record changed', () => {
      const user = TrackableRecord({
        name: 'yolo',
        family: TrackableRecord({
          father: 'Anakin Skywalker',
        }),
      })

      user.family.father = 'Darth Vader'

      expect(user.family.$$isChanged).toBe(true)
      expect(user.family.father).toBe('Darth Vader')
      expect(user.$$isChanged).toBe(true)
    })
  })

  describe('update', () => {
    const user = TrackableRecord({
      name: 'yolo',
    })

    user.update('name', (name) => name + 'yolo')

    expect(user.$$isChanged).toBe(true)
    expect(user.name).toBe('yoloyolo')
  })

  describe('delete', () => {
    const user = TrackableRecord({
      name: 'yolo',
    })

    user.delete('name')

    expect(user.$$isChanged).toBe(true)
    expect(user.name).toBeUndefined()
  })

  describe('clone', () => {
    it('clones nested record too', () => {
      const familyRecord = TrackableRecord({
        father: 'Anakin Skywalker',
      })
      const user = TrackableRecord({
        name: 'yolo',
        family: familyRecord,
      })
      user.family.father = 'Darth Vader'

      const newUser = user.clone()

      expect(newUser).not.toBe(user)
      expect(newUser.$$isChanged).toBe(false)
      expect(newUser.family).not.toBe(familyRecord)
      expect(newUser.family.$$isChanged).toBe(false)
      expect(newUser.family.father).toBe('Darth Vader')
    })
  })

  describe('toJS', () => {
    it('serializes record to pure object', () => {
      const user = TrackableRecord({
        name: 'yolo',
      })

      const serializedUser = user.toJS()

      expect(serializedUser.name).toBe('yolo')
    })

    it('serializes nested record', () => {
      const user = TrackableRecord({
        name: 'yolo',
        family: TrackableRecord({
          father: 'Anakin Skywalker',
        }),
      })

      const serializedUser = user.toJS()

      expect(serializedUser.name).toBe('yolo')
      expect(serializedUser.family.father).toBe('Anakin Skywalker')
    })
  })
})
