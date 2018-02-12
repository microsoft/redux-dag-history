import DagGraph from '../DagGraph'
import { DagHistory } from '../interfaces'
import jumpToState from './jumpToState'
import log from './log'

export default function skipToEnd<T>(history: DagHistory<T>): DagHistory<T> {
	log('skip to end')
	const { graph } = history
	const reader = new DagGraph(graph)

	const path = reader.branchCommitPath(reader.currentBranch)
	const result = path[path.length - 1]
	return jumpToState(result, history)
}
