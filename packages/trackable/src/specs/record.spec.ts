import {
  TrackableRecord,
  TrackableMap,
} from '..'

describe('TrackableRecord', () => {
  const FamilyRecord = TrackableRecord({
    father: '',
  })
  const UserRecord = TrackableRecord({
    name: '',
    family: FamilyRecord(),
    map: new TrackableMap(),
  })
  describe('constructor', () => {
    it('returns trackable record', () => {
      const user = UserRecord({
        name: 'yolo',
      })

      expect(user.$trackable).toBeDefined()
      expect(user.$trackable.isChanged).toBe(false)
      expect(user.name).toBe('yolo')
    })
  })

  describe('set', () => {
    it('sets data and is marked as changed', () => {
      const user = UserRecord({
        name: 'yolo',
      })

      user.name = 'test'

      expect(user.$trackable.isChanged).toBe(true)
      expect(user.name).toBe('test')
    })

    it('marks as changed when child trackable map changed', () => {
      const user = UserRecord({
        name: 'yolo',
        map: new TrackableMap({
          a: 'a',
        }),
      })

      user.map.set('a', 'b')

      expect(user.map.$trackable.isChanged).toBe(true)
      expect(user.map.get('a')).toBe('b')
      expect(user.$trackable.isChanged).toBe(true)
    })

    it('marks as changed when child trackable record changed', () => {
      const user = UserRecord({
        name: 'yolo',
        family: FamilyRecord({
          father: 'Anakin Skywalker',
        }),
      })

      user.family.father = 'Darth Vader'

      expect(user.family.$trackable.isChanged).toBe(true)
      expect(user.family.father).toBe('Darth Vader')
      expect(user.$trackable.isChanged).toBe(true)
    })

    describe('cloned', () => {
      it('sets data and is marked as changed', () => {
        const user = UserRecord({
          name: 'yolo',
        })

        const newUser = user.clone()

        newUser.name = 'test'
        expect(newUser.$trackable.isChanged).toBe(true)
        expect(newUser.name).toBe('test')
        expect(user.$trackable.isChanged).toBe(false)
        expect(user.name).toBe('yolo')
      })
    })
  })

  describe('update', () => {
    const user = UserRecord({
      name: 'yolo',
    })

    user.update('name', (name) => name + 'yolo')

    expect(user.$trackable.isChanged).toBe(true)
    expect(user.name).toBe('yoloyolo')
  })

  describe('delete', () => {
    const user = UserRecord({
      name: 'yolo',
    })

    user.delete('name')

    expect(user.$trackable.isChanged).toBe(true)
    expect(user.name).toBeUndefined()
  })

  describe('merge', () => {
    it('merges with partial object', () => {
      const user = UserRecord({
        name: 'yolo',
      })
      const newFamily = FamilyRecord({
        father: 'Darth Vader',
      })

      user.merge({
        name: 'yoloyolo',
        family: newFamily,
      })

      expect(user.$trackable.isChanged).toBe(true)
      expect(user.name).toBe('yoloyolo')
      expect(user.family).toBe(newFamily)
    })

    it('merges with partial entry iterator', () => {
      const user = UserRecord({
        name: 'yolo',
      })
      const newFamily = FamilyRecord({
        father: 'Darth Vader',
      })

      user.merge([
        ['name', 'yoloyolo'],
        ['family', newFamily],
      ])

      expect(user.$trackable.isChanged).toBe(true)
      expect(user.name).toBe('yoloyolo')
      expect(user.family).toBe(newFamily)
    })
  })

  describe('clone', () => {
    it('clones nested record too', () => {
      const familyRecord = FamilyRecord({
        father: 'Anakin Skywalker',
      })
      const user = UserRecord({
        name: 'yolo',
        family: familyRecord,
      })
      user.family.father = 'Darth Vader'

      const newUser = user.clone()

      expect(newUser).not.toBe(user)
      expect(newUser.$trackable.isChanged).toBe(false)
      expect(newUser.family).not.toBe(familyRecord)
      expect(newUser.family.$trackable.isChanged).toBe(false)
      expect(newUser.family.father).toBe('Darth Vader')
    })
  })

  describe('toJS', () => {
    it('serializes record to pure object', () => {
      const user = UserRecord({
        name: 'yolo',
      })

      const serializedUser = user.toJS()

      expect(serializedUser.name).toBe('yolo')
    })

    it('serializes nested record', () => {
      const user = UserRecord({
        name: 'yolo',
        family: FamilyRecord({
          father: 'Anakin Skywalker',
        }),
      })

      const serializedUser = user.toJS()

      expect(serializedUser.name).toBe('yolo')
      expect(serializedUser.family.father).toBe('Anakin Skywalker')
    })
  })
})
