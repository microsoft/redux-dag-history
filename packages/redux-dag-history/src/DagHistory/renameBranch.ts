import DagGraph from '../DagGraph'
import { BranchId, DagHistory } from '../interfaces'
import log from './log'

export default function renameBranch<T>(
	branchId: BranchId,
	branchName: string,
	history: DagHistory<T>,
): DagHistory<T> {
	const { graph } = history
	log('renaming branch %s => %s', branchId, branchName)
	return {
		...history,
		graph: graph.withMutations(g => {
			new DagGraph(g).setBranchName(branchId, branchName)
		}),
	}
}
