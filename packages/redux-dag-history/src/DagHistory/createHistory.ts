import { BranchId, Configuration, DagHistory, StateId } from '../interfaces'
import nextId from '../nextId'
import load from './load'

import log from './log'
const EMPTY_STATE: any = {}

export default function createHistory<T>(
	initialState: T = EMPTY_STATE,
	config: Configuration<T>,
): DagHistory<T> {
	log('creating history')
	const stateId: StateId = nextId()
	const branchId: BranchId = nextId()
	const { initialStateName, initialBranchName } = config

	// We may need to insert the initial hash into the state data, so construct it here
	const initialStateData = {
		name: initialStateName,
		branch: 1,
		hash: '',
	}

	// If possible, hash the initial state
	const stateHash: { [key: string]: any } = {}
	if (config && config.stateKeyGenerator) {
		const initialHash = config.stateKeyGenerator(initialState)
		stateHash[initialHash] = stateId
		initialStateData.hash = initialHash
	}

	return load<T>({
		current: initialState,
		graph: {
			/**
			 * The last used state id
			 */
			lastStateId: stateId,

			/**
			 * The last used branch id
			 */
			lastBranchId: branchId,

			/**
			 * A map of hash-code strings to state IDs. If a has function is defined in
			 * the configuration file, then these will be inserted.
			 */
			stateHash,

			/**
			 * A chronological listing of visited states
			 */
			chronologicalStates: [stateId],

			/**
			 * The current state and branch
			 */
			current: {
				state: stateId,
				branch: branchId,
			},

			/**
			 * A map of branch-ids to branch data
			 */
			branches: {
				[branchId]: {
					latest: stateId,
					name: initialBranchName,
					first: stateId,
					committed: stateId,
				},
			},

			/**
			 * A map of state-ids to state metadata
			 */
			states: {
				[stateId]: initialStateData,
			},

			/**
			 * A map of state ids to physical states
			 */
			physicalStates: {
				[stateId]: initialState,
			},
		},
	})
}
