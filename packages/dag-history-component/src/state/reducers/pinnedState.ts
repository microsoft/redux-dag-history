import { Configuration, StateId } from '@essex/redux-dag-history/lib/interfaces'
import { PIN_STATE } from '../actions/types'
import { Action } from 'redux-actions'

export interface State {
	id?: StateId
}

export const INITIAL_STATE = {}

export default function makeReducer(config: Configuration<any>) {
	return function reduce(
		state: State = INITIAL_STATE,
		action: ReduxActions.Action<any>,
	) {
		let result = state
		if (action.type === PIN_STATE) {
			const stateId = action.payload
			result = {
				...state,
				id: state.id === stateId ? undefined : stateId,
			}
		} else if (
			action.type.indexOf('DAG_HISTORY_') !== 0 &&
			config.actionFilter(action.type)
		) {
			result = INITIAL_STATE
		}
		return result
	}
}
