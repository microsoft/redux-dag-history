import DagGraph from '../DagGraph'
import { DagHistory, StateId } from '../interfaces'
import { jump } from './jump'

import log from './log'

export default function jumpToState<T>(
	stateId: StateId,
	history: DagHistory<T>,
): DagHistory<T> {
	log('jumping to state %s', stateId)
	const { graph } = history
	const reader = new DagGraph(graph)
	const branches = reader.branchesOf(stateId)
	const branch = reader.currentBranch

	return jump(stateId, history, writer => {
		if (branches.indexOf(branch) === -1) {
			const stateBranch = reader.branchOf(stateId)
			log(
				'current branch %s is not present on commit %s, available are [%s] - setting current branch to %s',
				branch,
				stateId,
				branches.join(', '),
				stateBranch,
			)
			writer.setCurrentBranch(stateBranch)
		} else {
			writer.setCommitted(branch, stateId)
		}
	})
}
