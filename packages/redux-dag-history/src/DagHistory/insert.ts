import DagGraph from '../DagGraph'
import { Configuration, DagHistory } from '../interfaces'
import nextId from '../nextId'
import log from './log'

/**
 * Inserts a new state into the history
 */
export default function insert<T>(
	state: T,
	history: DagHistory<T>,
	config: Configuration<T>,
): DagHistory<T> {
	log('inserting new history state')
	const { graph } = history
	if (!graph) {
		throw new Error('History graph is not defined')
	}

	const reader = new DagGraph(graph)
	const { lastStateId, lastBranchId } = reader
	const parentStateId = reader.currentStateId
	const currentBranchId = reader.currentBranch
	const newStateId = nextId(lastStateId)
	const newStateName = config.actionName(state, newStateId)
	const cousins = reader.childrenOf(parentStateId)
	const isBranching =
		cousins.length > 0 ||
		lastBranchId > currentBranchId ||
		currentBranchId === undefined

	return {
		current: state,
		graph: graph.withMutations(g => {
			const dg = new DagGraph(g)
				.insertState(newStateId, parentStateId, state, newStateName)
				.setCurrentStateId(newStateId)
				.setLastStateId(newStateId)

			// If the state has a hash code, register the state
			if (config.stateKeyGenerator) {
				const stateHash = config.stateKeyGenerator(state)
				log('inserting state with key', stateHash)
				dg.setHashForState(stateHash, newStateId)
			}

			if (isBranching) {
				const newBranchId = nextId(lastBranchId)
				const newBranch = config.branchName(
					currentBranchId,
					newBranchId,
					newStateName,
				)
				dg
					.setCurrentBranch(newBranchId)
					.setLastBranchId(newBranchId)
					.setBranchName(newBranchId, newBranch)
					.setLatest(newBranchId, newStateId)
					.setFirst(newBranchId, newStateId)
					.setCommitted(newBranchId, newStateId)
					.markStateForBranch(newStateId, newBranchId)
			} else {
				dg
					.setLatest(currentBranchId, newStateId)
					.setCommitted(currentBranchId, newStateId)
					.markStateForBranch(newStateId, currentBranchId)
			}
		}),
	}
}
