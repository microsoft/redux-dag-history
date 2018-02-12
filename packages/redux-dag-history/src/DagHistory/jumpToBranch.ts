import DagGraph from '../DagGraph'
import { BranchId, DagHistory, StateId } from '../interfaces'
import createBranch from './createBranch'
import { jump } from './jump'

import log from './log'

export default function jumpToBranch<T>(
	branch: BranchId,
	history: DagHistory<T>,
): DagHistory<T> {
	log('jumping to branch %s', branch)
	const { graph } = history
	const reader = new DagGraph(graph)
	const branches = reader.branches

	const jumpTo = (state: StateId) =>
		jump(state, history, writer => writer.setCurrentBranch(branch))

	if (branches.indexOf(branch) === -1) {
		return createBranch(branch, history)
	}
	return jumpTo(reader.committedOn(branch))
}
