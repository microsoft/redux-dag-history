import {
	Configuration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces'
import { PIN_STATE } from '../actions/types'

export const INITIAL_STATE = {
	id: undefined,
}

export default function makeReducer(config: Configuration<any>) {
	return function reduce(state = INITIAL_STATE, action) {
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
