import {addFilter} from '../../lib/style'

test('default styles', () => {
    expect(addFilter()).toEqual(false)
})