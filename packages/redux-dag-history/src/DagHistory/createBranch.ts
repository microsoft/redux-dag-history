import DagGraph from '../DagGraph'
import { DagHistory } from '../interfaces'
import nextId from '../nextId'
import log from './log'

export default function createBranch<T>(
	branchName: string,
	history: DagHistory<T>,
): DagHistory<T> {
	log('creating branch %s', branchName)
	const { graph, current } = history
	const reader = new DagGraph(graph)

	return {
		current,
		graph: graph.withMutations(g => {
			const { lastBranchId } = reader
			const newBranchId = nextId(lastBranchId)
			return reader
				.setCurrentBranch(newBranchId)
				.setLastBranchId(newBranchId)
				.setBranchName(newBranchId, branchName)
				.setCommitted(newBranchId, reader.currentStateId)
				.setFirst(newBranchId, reader.currentStateId)
				.setLatest(newBranchId, reader.currentStateId)
		}),
	}
}
