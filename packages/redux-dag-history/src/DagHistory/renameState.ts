import DagGraph from '../DagGraph'
import { DagHistory, StateId } from '../interfaces'
import log from './log'

export default function renameState<T>(
	stateId: StateId,
	name: string,
	history: DagHistory<T>,
): DagHistory<T> {
	log('rename state %s => %s', stateId, name)
	const { graph } = history
	return {
		current: history.current,
		graph: graph.withMutations(g => new DagGraph(g).renameState(stateId, name)),
	}
}
