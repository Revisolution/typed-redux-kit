// Polyfill
const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
const concat = Function.bind.call(Function.call, Array.prototype.concat)
const keys = Reflect.ownKeys

if (!Object.values) {
  Object.values = function values<T extends {}, K extends keyof T>(O: T) {
    return reduce(keys(O), (v: T[K], k: K) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
  }
}

if (!Object.entries) {
  Object.entries = function entries<T extends {}, K extends keyof T>(O: T) {
    return reduce(keys(O), (e: Array<[K, T]>, k: K) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), [])
  }
}
