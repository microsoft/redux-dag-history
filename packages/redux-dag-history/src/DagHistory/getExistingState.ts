import DagGraph from '../DagGraph'
import { Configuration, DagHistory, StateId } from '../interfaces'
import log from './log'

/**
 * When a state is being inserted into the system, we can optionally check to see if it's
 * a duplicate of an existing state. We perform a hash check and an equality check to
 * determine if the state is, in fact, a duplicate.
 */
export default function getExistingState<T>(
	newState: T,
	history: DagHistory<T>,
	config: Configuration<T>,
): StateId | null {
	if (config.stateKeyGenerator && config.stateEqualityPredicate) {
		const dagGraph = new DagGraph(history.graph)
		const hash = config.stateKeyGenerator(newState)
		const found = dagGraph.getStateForHash(hash)

		if (found) {
			const existingState = new DagGraph<T>(history.graph).getState(found)
			const areEqual = config.stateEqualityPredicate(newState, existingState)
			if (areEqual) {
				return found
			}
			log('found hashed state not equal')
		} else {
			log('no hashed state found')
		}
	} else {
		log('skip existing state check')
	}
	return null
}
