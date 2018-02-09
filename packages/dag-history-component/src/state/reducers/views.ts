import {
	SELECT_HISTORY_TYPE,
	SELECT_MAIN_VIEW,
	TOGGLE_BRANCH_CONTAINER,
} from '../actions/types'
import { ComponentConfiguration } from '../interfaces'
import isHistoryAction from './isHistoryAction'
import { Action } from 'redux-actions'

export interface State {
	mainView: string
	historyType: string
	branchContainerExpanded: boolean
}

export const INITIAL_STATE: State = {
	mainView: 'history',
	historyType: 'branched',
	branchContainerExpanded: true,
}

export default function makeReducer<T>(config: ComponentConfiguration<T>) {
	const initialState = {
		...INITIAL_STATE,
		...config.initialViewState,
	}
	return function reduce(
		state: State = initialState,
		action: ReduxActions.Action<any>,
	) {
		let result = state
		if (action.type === SELECT_MAIN_VIEW) {
			result = {
				...state,
				mainView: action.payload,
			}
		} else if (action.type === SELECT_HISTORY_TYPE) {
			result = {
				...state,
				historyType: action.payload,
			}
		} else if (action.type === TOGGLE_BRANCH_CONTAINER) {
			result = {
				...state,
				branchContainerExpanded: !state.branchContainerExpanded,
			}
		} else if (!isHistoryAction(action) && config.actionFilter(action.type)) {
			// Insertable actions clear the pinned state
			result = {
				...state,
				mainView: 'history',
			}
		}
		return result
	}
}
