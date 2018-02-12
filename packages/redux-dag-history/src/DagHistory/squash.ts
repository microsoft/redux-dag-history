import DagGraph from '../DagGraph'
import { DagHistory } from '../interfaces'

import log from './log'

export default function squash<T>(history: DagHistory<T>): DagHistory<T> {
	log('squashing history')
	const { graph, current } = history
	return {
		current,
		graph: graph.withMutations(g => new DagGraph(g).squashCurrentBranch()),
	}
}
