import isNumber from '../../src/util/isNumber'

describe('The isNumber module', () => {
	it('returns true on numeric inputs', () => {
		expect(isNumber(0)).toBeTruthy()
		expect(isNumber(1)).toBeTruthy()
		expect(isNumber(-1)).toBeTruthy()
		expect(isNumber(Number.MAX_VALUE)).toBeTruthy()
		expect(isNumber(Number.MIN_VALUE)).toBeTruthy()
	})

	it('returns false on non-numeric inputs', () => {
		expect(isNumber(NaN)).toBeFalsy()
		expect(isNumber(Infinity)).toBeFalsy()
		expect(isNumber({})).toBeFalsy()
		expect(isNumber(() => ({}))).toBeFalsy()
		expect(isNumber('')).toBeFalsy()
	})
})
