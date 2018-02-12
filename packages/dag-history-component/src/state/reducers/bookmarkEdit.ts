import { Action } from 'redux-actions'
import { Configuration } from '@essex/redux-dag-history'
import {
	BOOKMARK_EDIT,
	MOVE_BOOKMARK,
	BOOKMARK_EDIT_DONE,
} from '../actions/types'
import isHistoryAction from './isHistoryAction'
import makeReducer from './configurableReducer'

export interface State {
	editIndex: number
}

const INITIAL_STATE: State = {
	editIndex: undefined,
}

function reducer(
	state: State = INITIAL_STATE,
	action: ReduxActions.Action<any>,
	config: Configuration<any>,
) {
	if (action.type === BOOKMARK_EDIT) {
		// Edit a bookmark
		return { editIndex: action.payload }
	} else if (
		action.type === MOVE_BOOKMARK &&
		action.payload.from === state.editIndex
	) {
		// If the user is moving the currently edited bookmark, update the editIndex
		return { editIndex: action.payload.to }
	} else if (
		action.type === BOOKMARK_EDIT_DONE ||
		(!isHistoryAction(action) && config.actionFilter(action.type))
	) {
		// Clear the edit state
		return INITIAL_STATE
	}
	return state
}

export default makeReducer(reducer)
