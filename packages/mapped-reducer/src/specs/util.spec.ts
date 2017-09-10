import * as Util from '../lib/util'

describe('Util.getActionTypes', () => {
  it('gets an action from string', () => {
    const input = 'Tango'

    const actionTypes = Util.getActionTypes(input)

    expect(actionTypes).toEqual(['Tango'])
  })

  it('gets actions from array', () => {
    const input = ['Tango', 'Tango2']

    const actionTypes = Util.getActionTypes(input)

    expect(actionTypes).toEqual(['Tango', 'Tango2'])
  })

  it('gets actioins from string enum', () => {
    enum ActionTypes {
      Tango = 'Tango',
      Tango2 = 'Tango2',
    }

    const actionTypes = Util.getActionTypes(ActionTypes)

    expect(actionTypes).toEqual(['Tango', 'Tango2'])
  })
})
