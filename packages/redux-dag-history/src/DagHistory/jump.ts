import DagGraph from '../DagGraph'
import { DagHistory, StateId } from '../interfaces'
import unfreeze from './unfreeze'

//
// Provides state jumping without special rules applied.
// This allows us to share common state-jumping code.
//

/**
 * Jumps to a specific state
 */
export function jump<T>(
	stateId: StateId,
	history: DagHistory<T>,
	callback: ((g: DagGraph<T>) => void) = () => ({}),
): DagHistory<T> {
	const { graph } = history
	const reader = new DagGraph(graph)
	const targetState = reader.getState(stateId)
	return {
		current: unfreeze(targetState),
		graph: graph.withMutations(g => {
			const writer = new DagGraph<T>(g) // eslint-disable-line new-parens
				.setCurrentStateId(stateId)
			callback(writer)
		}),
	}
}

/**
 * Jumps to a specific state, while logging this visitation in the chronological states array.
 */
export function jumpLog<T>(
	stateId: StateId,
	history: DagHistory<T>,
	callback: ((g: DagGraph<T>) => void) = () => ({}),
): DagHistory<T> {
	const { graph } = history
	const { currentStateId: alternateParent } = new DagGraph(graph)

	return jump(stateId, history, writer => {
		writer.setAlternateParent(stateId, alternateParent)
		callback(writer)
	})
}
