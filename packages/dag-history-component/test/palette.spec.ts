import palette from '../src/palette'

describe('The Palette Module', () => {
	it('exposes a default colors object full of color strings', () => {
		Object.keys(palette).forEach(k =>
			expect(typeof palette[k]).toEqual('string'),
		)
	})
})
