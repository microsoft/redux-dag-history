import {
	default as makeReducer,
	INITIAL_STATE,
} from '../../../src/state/reducers/views'

import {
	selectHistoryType,
	selectMainView,
	toggleBranchContainer,
} from '../../../src/state/actions/creators'

const defaultConfig = {
	actionFilter: () => false,
}

describe('The Views reducer', () => {
	it('will emit an initial dragDrop state', () => {
		const state = makeReducer(defaultConfig as any)(undefined, { type: 'derp' })
		expect(state).toEqual(INITIAL_STATE)
	})

	it('can handle a selectMainView event', () => {
		const reduce = makeReducer(defaultConfig as any)
		const state = reduce(undefined, selectMainView('bookmarks'))
		expect(state).toEqual({
			...INITIAL_STATE,
			mainView: 'bookmarks',
		})
	})

	it('can handle a selectHistoryType event', () => {
		const reduce = makeReducer(defaultConfig as any)
		const state = reduce(undefined, selectHistoryType('derp'))
		expect(state).toEqual({
			...INITIAL_STATE,
			historyType: 'derp',
		})
	})

	it('can handle a toggleBranchContainer event', () => {
		let state
		const reduce = makeReducer(defaultConfig as any)
		state = reduce(state, { type: 'derp' })
		expect(state.branchContainerExpanded).toBeTruthy()

		state = reduce(state, toggleBranchContainer({ index: 3 }))
		expect(state.branchContainerExpanded).toBeFalsy()

		state = reduce(state, toggleBranchContainer({ index: 3 }))
		expect(state.branchContainerExpanded).toBeTruthy()
	})
})
