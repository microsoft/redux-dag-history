import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionTypes'
import * as sinon from 'sinon'
import * as ActionCreators from '../../../src/state/actions/creators'
import * as ActionTypes from '../../../src/state/actions/types'

describe('The Action Creators Module', () => {
	it('has action creators that emit FSA-compliant actions', () => {
		expect(ActionCreators.selectMainView('derp')).toEqual({
			type: ActionTypes.SELECT_MAIN_VIEW,
			payload: 'derp',
		})
		expect(ActionCreators.toggleBranchContainer({ index: 3 })).toEqual({
			type: ActionTypes.TOGGLE_BRANCH_CONTAINER,
			payload: {
				index: 3,
			},
		})
	})

	describe('the bookmarkDragDrop action', () => {
		it('will emit a drop event and a moveBookmark event', () => {
			const dispatch = sinon.spy()
			ActionCreators.bookmarkDragDrop({ index: 0, droppedOn: 1 })(dispatch)

			expect(dispatch.callCount).toEqual(2)
			const firstAction = dispatch.getCall(0).args[0]
			expect(firstAction.type).toEqual(ActionTypes.BOOKMARK_DRAG_DROP)
			expect(firstAction.payload).toBeUndefined()

			const secondAction = dispatch.getCall(1).args[0]
			expect(secondAction.type).toEqual(ActionTypes.MOVE_BOOKMARK)
			expect(secondAction.payload).toEqual({ from: 0, to: 1 })
		})

		it('will only emit a drop event when the to index is invalid', () => {
			const dispatch = sinon.spy()
			ActionCreators.bookmarkDragDrop({ index: 1, droppedOn: undefined })(
				dispatch,
			)

			expect(dispatch.callCount).toEqual(1)
			const firstAction = dispatch.getCall(0).args[0]
			expect(firstAction.type).toEqual(ActionTypes.BOOKMARK_DRAG_DROP)
		})
	})

	describe('the selectBookmarkDepth action', () => {
		it('will emit bookmark selection and jump events', () => {
			const bookmarkIndex = 5
			const depth = 7
			const state = '10'

			const dispatch = sinon.spy()
			ActionCreators.selectBookmarkDepth({ bookmarkIndex, depth, state })(
				dispatch,
			)

			expect(dispatch.callCount).toEqual(2)
			const firstAction = dispatch.getCall(0).args[0]
			expect(firstAction.type).toEqual(ActionTypes.SELECT_BOOKMARK_DEPTH)
			expect(firstAction.payload).toEqual({ bookmarkIndex, depth })

			const secondAction = dispatch.getCall(1).args[0]
			expect(secondAction.type).toEqual(DagHistoryActions.JUMP_TO_STATE)
			expect(secondAction.payload).toEqual(state)
		})
	})

	describe('the selectBookmark action', () => {
		it('will emit bookmark selection and jump events', () => {
			const bookmarkIndex = 3
			const state = '7'
			const dispatch = sinon.spy()
			ActionCreators.selectBookmark(bookmarkIndex, state)(dispatch)

			expect(dispatch.callCount).toEqual(2)
			const firstAction = dispatch.getCall(0).args[0]
			expect(firstAction.type).toEqual(ActionTypes.SELECT_BOOKMARK_DEPTH)
			expect(firstAction.payload).toEqual({
				bookmarkIndex,
				depth: undefined,
			})

			const secondAction = dispatch.getCall(1).args[0]
			expect(secondAction.type).toEqual(DagHistoryActions.JUMP_TO_STATE)
			expect(secondAction.payload).toEqual(state)
		})
	})
})
