import { Configuration, DagHistory } from '../interfaces'
import createHistory from './createHistory'
import log from './log'

export default function clear<T>(
	history: DagHistory<T>,
	config: Configuration<T>,
): DagHistory<T> {
	log('clearing history')
	const { current } = history
	return createHistory(current, config)
}
