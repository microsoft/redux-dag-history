import * as types from '../../../src/state/actions/types'

describe('Action Types', () => {
	it('should all be strings', () => {
		Object.keys(types).forEach(key =>
			expect(typeof types[key]).toEqual('string'),
		)
	})
})
