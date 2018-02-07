import { Map as ImmutableMap } from 'immutable'
export type StateId = KeyType
export type BranchId = KeyType
export type StateHash = string

export interface Configuration<T> {
	/**
	 * A flag indicating whether or not to print per-action debug information
	 */
	debug?: boolean

	/**
	 * A Predicate filter to determine whether an action is insertable into the history view.
	 * If an action is not insertable, then the new state as the result of the action will replace
	 * the current state
	 */
	actionFilter?: (actionType: string) => boolean

	/**
	 * A predicate for determining whether two states are equal
	 */
	stateEqualityPredicate?: (s1: T, s2: T) => boolean

	/**
	 * A function for generating map keys for states
	 */
	stateKeyGenerator?: (state: T) => StateHash

	/**
	 * Action Names
	 */
	loadActionType?: string
	clearActionType?: string
	undoActionType?: string
	redoActionType?: string
	jumpToStateActionType?: string
	jumpToBranchActionType?: string
	jumpToLatestOnBranchActionType?: string
	createBranchActionType?: string
	squashActionType?: string
	renameBranchActionType?: string
	renameStateActionType?: string
	initialBranchName?: string
	initialStateName?: string
	skipToStartActionType?: string
	skipToEndActionType?: string

	/**
	 * State and Branch Naming
	 */
	actionName?: (state: any, stateId: StateId) => string
	branchName?: (
		oldBranch: BranchId,
		newBranch: BranchId,
		actionName: string,
	) => string

	// Custom Handlers
	canHandleAction?: (action: any) => boolean
	handleAction?: (action: any, history: DagHistory<T>) => DagHistory<T>
}

/**
 * This interface represents the state shape of the DAG history in the Redux
 * state tree.
 */
export interface DagHistory<T> {
	/**
	 * The current application state
	 */
	current: T

	/**
	 * The explored state space, represented as a graph (future and past).
	 * See DagGraph.ts and createHistory.ts for more details on the structure of this
	 */
	graph: ImmutableMap<any, any>
}

export type StateIdGenerator = (lastStateId: StateId) => StateId

export type StateNameGenerator = (state: any, id: StateId) => string

export interface RenameBranchPayload {
	branch: BranchId
	name: string
}
