export const getValues = Object.values

export function isPlainObject (value: any) {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Get action types from type, type array and type enum
 *
 * @export
 * @template ACTION_TYPE
 * @param {(ACTION_TYPE | ACTION_TYPE[] | {[key: number]: ACTION_TYPE} | {[key: string]: ACTION_TYPE})} actionTypeOrActionTypes
 * @returns {ACTION_TYPE[]}
 */
export function getActionTypes <ACTION_TYPE>(actionTypeOrActionTypes: ACTION_TYPE | ACTION_TYPE[] | {[key: number]: ACTION_TYPE} | {[key: string]: ACTION_TYPE}): ACTION_TYPE[] {
  return Array.isArray(actionTypeOrActionTypes)
  ? actionTypeOrActionTypes
  : isPlainObject(actionTypeOrActionTypes)
  ? getValues(actionTypeOrActionTypes as object)
  : [actionTypeOrActionTypes]
}
