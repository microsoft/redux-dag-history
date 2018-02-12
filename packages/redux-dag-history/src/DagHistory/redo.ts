import DagGraph from '../DagGraph'
import { DagHistory } from '../interfaces'
import jumpToState from './jumpToState'
import log from './log'

export default function redo<T>(history: DagHistory<T>): DagHistory<T> {
	const { graph } = history
	const reader = new DagGraph(graph)
	const children = reader
		.childrenOf(reader.currentStateId)
		.filter(
			child => reader.branchesOf(child).indexOf(reader.currentBranch) !== -1,
		)

	if (children.length > 0) {
		log('redo')
		const nextStateId = children[0]
		return jumpToState(nextStateId, history)
	}
	log('cannot redo')
	return history
}
