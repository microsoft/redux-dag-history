import DagGraph from '../DagGraph'
import { DagHistory } from '../interfaces'
import jumpToState from './jumpToState'
import log from './log'

export default function skipToStart<T>(history: DagHistory<T>): DagHistory<T> {
	log('skip to start')
	const { graph } = history
	const reader = new DagGraph(graph)

	let result = reader.currentStateId
	while (reader.parentOf(result) !== null) {
		result = reader.parentOf(result)
	}
	return jumpToState(result, history)
}
