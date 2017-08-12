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
  })

  describe('clone', () => {
    it('returns clean array', () => {
      const arr = TrackableArray<number>([1])
      arr[0] = 2

      const newArr = arr.clone()

      expect(newArr[0]).toBe(2)
      expect(newArr.$trackable.isChanged).toBe(false)
    })
  })

  describe('reserveArrayBuffer', () => {
    describe('when exceeding maximum buffer', () => {
      it('reserves more buffer on demand', () => {
        const hugeArray = Array.from({length: 1001}).map((v, k) => k)
        const arr = TrackableArray<number>(hugeArray)

        expect(arr[1000]).toBe(1000)
      })
    })
  })
})
