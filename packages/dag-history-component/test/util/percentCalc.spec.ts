import calculateIndex from '../../src/util/calculateIndex'

const adjust = (x: number) => x - 0.001

describe('Percent calculations (for mouse intercepts in a DOM element)', () => {
	it('can determine the item to select based on a percentage range', () => {
		// [[--|---|---|---]
		expect(calculateIndex(4, -1)).toEqual(0)

		// [[--|---|---|---]
		expect(calculateIndex(4, 0)).toEqual(0)

		// [x--|---|---|---]
		expect(calculateIndex(4, adjust(1 / 12))).toEqual(0)

		// [-x-|---|---|---]
		expect(calculateIndex(4, adjust(2 / 12))).toEqual(0)

		// [--x|---|---|---]
		expect(calculateIndex(4, adjust(3 / 12))).toEqual(0)

		// [---|x--|---|---]
		expect(calculateIndex(4, adjust(4 / 12))).toEqual(1)

		// [---|-x-|---|---]
		expect(calculateIndex(4, adjust(5 / 12))).toEqual(1)

		// [---|--x|---|---]
		expect(calculateIndex(4, adjust(6 / 12))).toEqual(1)

		// [---|---|x--|---]
		expect(calculateIndex(4, adjust(7 / 12))).toEqual(2)

		// [---|---|-x-|---]
		expect(calculateIndex(4, adjust(8 / 12))).toEqual(2)

		// [---|---|--x|---]
		expect(calculateIndex(4, adjust(9 / 12))).toEqual(2)

		// [---|---|---|x--]
		expect(calculateIndex(4, adjust(10 / 12))).toEqual(3)

		// [---|---|---|-x-]
		expect(calculateIndex(4, adjust(11 / 12))).toEqual(3)

		// [---|---|---|--x]
		expect(calculateIndex(4, adjust(12 / 12))).toEqual(3)

		// [--|---|---|---]]
		expect(calculateIndex(4, 1.0)).toEqual(3)
	})
})
