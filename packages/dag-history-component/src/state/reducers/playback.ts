import { Configuration } from '@essex/redux-dag-history/lib/interfaces'
import {
	SELECT_BOOKMARK_DEPTH,
	START_PLAYBACK,
	STOP_PLAYBACK,
} from '../actions/types'
import isHistoryAction from './isHistoryAction'
import { Action } from 'redux-actions'
import makeReducer from './configurableReducer'

export interface State {
	isPlayingBack: boolean
	bookmark?: number
	depth?: number
}

export const INITIAL_STATE: State = {
	isPlayingBack: false,
	bookmark: undefined,
	depth: undefined,
}

function reduce(
	state: State = INITIAL_STATE,
	action: ReduxActions.Action<any>,
	config: Configuration<any>,
) {
	let result = state
	if (action.type === START_PLAYBACK) {
		const { initialDepth } = action.payload
		result = {
			...state,
			isPlayingBack: true,
			bookmark: 0,
			depth: initialDepth,
		}
	} else if (action.type === STOP_PLAYBACK) {
		result = INITIAL_STATE
	} else if (action.type === SELECT_BOOKMARK_DEPTH) {
		const { depth, bookmarkIndex } = action.payload
		result = {
			...state,
			bookmark: bookmarkIndex === undefined ? state.bookmark : bookmarkIndex,
			depth,
		}
	} else if (!isHistoryAction(action) && config.actionFilter(action.type)) {
		// Insertable actions clear the pinned state
		result = {
			...state,
			isPlayingBack: false,
			bookmark: undefined,
			depth: undefined,
		}
	}
	return result
}

export default makeReducer(reduce)
