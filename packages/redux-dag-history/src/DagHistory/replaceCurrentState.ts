import DagGraph from '../DagGraph'

import { Configuration, DagHistory } from '../interfaces'

import log from './log'

export default function replaceCurrentState<T>(
	state: any,
	history: DagHistory<T>,
	config: Configuration<T>,
): DagHistory<T> {
	log('replace current state')
	const { graph } = history
	const reader = new DagGraph(graph)
	const currentStateId = reader.currentStateId

	return {
		current: state,
		graph: graph.withMutations(g => {
			const graphMutate = new DagGraph(g)

			// If the state has a hash code, register the state
			if (config.stateKeyGenerator) {
				const hash = config.stateKeyGenerator(state)
				log('inserting state with key', hash)
				graphMutate.setHashForState(hash, currentStateId)
			}

			return graphMutate.replaceState(currentStateId, state)
		}),
	}
}
