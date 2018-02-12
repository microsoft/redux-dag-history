import DagGraph from '../DagGraph'
import { DagHistory } from '../interfaces'
import jumpToState from './jumpToState'

import log from './log'

export default function undo<T>(history: DagHistory<T>): DagHistory<T> {
	const { graph } = history
	const reader = new DagGraph(graph)
	const parentId = reader.parentOf(reader.currentStateId)
	if (parentId !== null && parentId !== undefined) {
		log('undoing %s => %s', reader.currentStateId, parentId)
		return jumpToState(parentId, history)
	}
	log('cannot undo')
	return history
}
