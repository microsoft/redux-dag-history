import { reducer as dagHistoryReducer } from '@essex/redux-dag-history'
import * as debug from 'debug'
import * as redux from 'redux'

import Configuration from '@essex/dag-history-component/lib/state/Configuration'
import history from '@essex/dag-history-component/lib/state/reducers'
import app, { State as AppState } from './app'
import hashString from '../../util/hashString'

const log = debug('app:state')

export const EXCLUDED_ACTION_NAMES = [
	'@@INIT',
	'INIT',
	'TOGGLE_BRANCH_CONTAINER',
	'SELECT_MAIN_VIEW',
	'SELECT_HISTORY_TYPE',
	'RETRIEVE_INITIAL_STATE_IGNORE_THIS_EVENT',
	'HIGHLIGHT_SUCCESSORS',
]

function stateEqualityPredicate(state1: AppState, state2: AppState) {
	log('checking equality between states', state1, state2)
	const colorsEqual = state1.visuals.color === state2.visuals.color
	const valuesEqual = state1.visuals.value === state2.visuals.value
	return colorsEqual && valuesEqual
}

function stateKeyGenerator(state: AppState) {
	const { color, value } = state.visuals
	const stateString = `${color}:${value}`
	return '' + hashString(stateString)
}

const DAG_HISTORY_CONFIG = new Configuration({
	// Middleware Config
	debug: false,
	actionName: state => state.metadata.name,
	actionFilter: actionType => EXCLUDED_ACTION_NAMES.indexOf(actionType) === -1,
	stateEqualityPredicate,
	stateKeyGenerator,

	// UI Config
	initialViewState: {
		branchContainerExpanded: true,
	},
})

export interface State {
	app: AppState
	component: any // TODO: Create a state interface for the component
}

export default redux.combineReducers({
	app: dagHistoryReducer(app, DAG_HISTORY_CONFIG),
	component: history(DAG_HISTORY_CONFIG),
})
