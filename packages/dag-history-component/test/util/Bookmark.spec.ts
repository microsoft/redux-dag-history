import Bookmark from '../../src/util/Bookmark'
import { Bookmark as BookmarkData } from '../../src/interfaces'

class TestableBookmark extends Bookmark {
	constructor(bookmark: BookmarkData, private commitPathVar: string[]) {
		super(bookmark, null)
	}

	public get commitPath() {
		return this.commitPathVar
	}
}

describe('The Bookmark Class', () => {
	it('can be constructed', () => {
		const bm = new TestableBookmark(({} as any) as BookmarkData, [])
		expect(bm).toBeDefined()
	})

	it('can determine the number of lead-in states', () => {
		let bm = new TestableBookmark({ data: { numLeadInStates: 3 } } as any, [])
		expect(bm.numLeadInStates).toEqual(3)

		bm = new TestableBookmark({ data: {} } as any, [])
		expect(bm.numLeadInStates).toEqual(undefined)

		bm = new TestableBookmark({} as any, [])
		expect(bm.numLeadInStates).toEqual(undefined)
	})

	it('can determine the annotation', () => {
		let bm = new TestableBookmark({} as any, [])
		expect(bm.annotation).toBeUndefined()

		bm = new TestableBookmark({ data: {} } as any, [])
		expect(bm.annotation).toBeUndefined()

		bm = new TestableBookmark({ data: { annotation: 'abc123' } } as any, [])
		expect(bm.annotation).toEqual('abc123')
	})

	it('can determine the bookmark name', () => {
		const bm = new TestableBookmark({ name: 'derp' } as any, [])
		expect(bm.name).toEqual('derp')
	})

	it('can determine the state id', () => {
		const bm = new TestableBookmark({ stateId: 5 } as any, [])
		expect(bm.stateId).toEqual(5)
	})

	it('can determine the slide text for the current bookmark', () => {
		let bm = new TestableBookmark({ data: { annotation: 'anno' } } as any, [])
		expect(bm.slideText).toEqual('anno')

		bm = new TestableBookmark({ name: 'derp' } as any, [])
		expect(bm.slideText).toEqual('derp')

		bm = new TestableBookmark({} as any, [])
		expect(bm.slideText).toEqual('No slide data')
	})

	it('can determine the presented path', () => {
		let bm = new TestableBookmark({ data: { numLeadInStates: 1 } } as any, [
			'1',
			'2',
			'3',
			'4',
		])
		expect(bm.presentedPath).toEqual([3, 4])
		expect(bm.presentedPathLength).toEqual(2)
		expect(bm.hiddenPathLength).toEqual(2)

		bm = new TestableBookmark({ data: {} } as any, ['1', '2', '3', '4'])
		expect(bm.presentedPath).toEqual([4])
		expect(bm.presentedPathLength).toEqual(1)
		expect(bm.hiddenPathLength).toEqual(3)
	})

	it('can determine starting and ending depth', () => {
		let bm = new TestableBookmark({ data: { numLeadInStates: 1 } } as any, [
			'1',
			'2',
			'3',
			'4',
		])
		expect(bm.startingDepth()).toEqual(2)
		expect(bm.isDepthAtStart(2)).toBeTruthy()
		expect(bm.isDepthAtEnd(0)).toBeFalsy()
		expect(bm.isDepthAtEnd(3)).toBeTruthy()
		expect(bm.isDepthAtEnd(undefined)).toBeTruthy()

		bm = new TestableBookmark({ data: {} } as any, ['1', '2', '3', '4'])
		expect(bm.startingDepth()).toBeUndefined()
		expect(bm.isDepthAtStart(3)).toBeTruthy()
		expect(bm.isDepthAtEnd(0)).toBeFalsy()
		expect(bm.isDepthAtEnd(3)).toBeTruthy()
		expect(bm.isDepthAtEnd(undefined)).toBeTruthy()
	})

	it('can get a state at a depth', () => {
		const bm = new TestableBookmark({ data: { numLeadInStates: 1 } } as any, [
			'1',
			'2',
			'3',
			'4',
		])
		expect(bm.getStateAtDepth(undefined)).toEqual(4)
		expect(bm.getStateAtDepth(0)).toEqual(1)
	})

	it('can sanitize a depth', () => {
		const bm = new TestableBookmark({ data: { numLeadInStates: 1 } } as any, [
			'1',
			'2',
			'3',
			'4',
		])
		expect(bm.sanitizeDepth(undefined)).toEqual(3)
	})
})
