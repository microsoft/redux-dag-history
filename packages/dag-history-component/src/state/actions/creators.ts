import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import { StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as ReduxActions from 'redux-actions'
import { Dispatch } from 'redux'
import * as Types from './types'

const { createAction } = ReduxActions

// Simple Action Creators
const doSelectBookmarkDepth = createAction<BookmarkDepthSelection>(
	Types.SELECT_BOOKMARK_DEPTH,
)
const doBookmarkDragDrop = createAction(Types.BOOKMARK_DRAG_DROP)
export const doStartPlayback = createAction<StartPlaybackPayload>(
	Types.START_PLAYBACK,
)
export const selectMainView = createAction(Types.SELECT_MAIN_VIEW)
export const selectHistoryType = createAction<string>(Types.SELECT_HISTORY_TYPE)
export const toggleBranchContainer = createAction(Types.TOGGLE_BRANCH_CONTAINER)
export const stopPlayback = createAction(Types.STOP_PLAYBACK)
export const bookmarkDragStart = createAction<BookmarkDragStartPayload>(
	Types.BOOKMARK_DRAG_START,
)
export const bookmarkDragHover = createAction<BookmarkDragHoverPayload>(
	Types.BOOKMARK_DRAG_HOVER,
)
export const bookmarkDragCancel = createAction(Types.BOOKMARK_DRAG_CANCEL)
export const addBookmark = createAction<AddBookmarkPayload>(Types.ADD_BOOKMARK)
export const removeBookmark = createAction<StateId>(Types.REMOVE_BOOKMARK)
export const renameBookmark = createAction<RenameBookmarkPayload>(
	Types.RENAME_BOOKMARK,
)
export const doChangeBookmark = createAction<ChangeBookmarkPayload>(
	Types.CHANGE_BOOKMARK,
)
export const moveBookmark = createAction<MoveBookmarkPayload>(
	Types.MOVE_BOOKMARK,
)
export const pinState = createAction<StateId>(Types.PIN_STATE)
export const bookmarkEdit = createAction<number>(Types.BOOKMARK_EDIT)
export const bookmarkEditDone = createAction(Types.BOOKMARK_EDIT_DONE)

// Composite Action Creators
export function changeBookmark(payload: ChangeBookmarkPayload) {
	return (dispatch: Dispatch<any>) => {
		dispatch(doChangeBookmark(payload))
		dispatch(bookmarkEditDone())
	}
}

export function startPlayback(payload: StartPlaybackPayload) {
	return (dispatch: Dispatch<any>) => {
		dispatch(DagHistoryActions.jumpToState(payload.stateId))
		dispatch(doStartPlayback(payload))
	}
}

export function bookmarkDragDrop(payload: BookmarkDragDropPayload) {
	return (dispatch: Dispatch<any>) => {
		dispatch(doBookmarkDragDrop())
		if (payload.droppedOn >= 0) {
			dispatch(
				moveBookmark({
					from: payload.index,
					to: payload.droppedOn,
				}),
			)
		}
	}
}

export const selectBookmarkDepth = (
	payload: BookmarkDepthAndStateSelection,
) => {
	const { bookmarkIndex, depth, state } = payload
	return (dispatch: Redux.Dispatch<any>) => {
		dispatch(doSelectBookmarkDepth({ bookmarkIndex, depth }))
		dispatch(DagHistoryActions.jumpToState(state))
	}
}

export const selectBookmark = (bookmarkIndex: number, state: StateId) =>
	selectBookmarkDepth({
		bookmarkIndex,
		depth: undefined,
		state,
	})

export interface StartPlaybackPayload {
	initialDepth: number
	stateId: StateId
}

export interface AddBookmarkPayload {
	stateId: StateId
	name: string
	data?: { [name: string]: any }
}

export interface BookmarkDragStartPayload {
	index: number
	key: string
}

export interface BookmarkDragHoverPayload {
	index: number
}

export interface BookmarkDragDropPayload {
	index: number
	droppedOn: number
}

export interface BookmarkDepthSelection {
	bookmarkIndex?: number
	depth?: number
}

export interface BookmarkDepthAndStateSelection {
	bookmarkIndex: number
	depth: number
	state: StateId
}

export interface RenameBookmarkPayload {
	stateId: StateId
	name: string
}

export interface MoveBookmarkPayload {
	from: number
	to: number
}

export interface ChangeBookmarkPayload {
	stateId: StateId
	name: string
	data: any
}
