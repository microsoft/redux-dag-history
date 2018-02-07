import * as debug from 'debug'
import { Reducer } from 'redux'
import { Action } from 'redux-actions'
import Configuration from './Configuration'
import DagGraph from './DagGraph'
import * as DagHistoryImpl from './DagHistory'
import { DagHistory } from './interfaces'

const log = debug('redux-dag-history:reducer')

const EMPTY_ACTION: Action<any> = {
	type: '__EMPTY_ACTION__',
	payload: undefined,
}

/**
 * A redux higher-order Reducer for tracking the user's history.
 */
export default function trackHistory<T>(
	reducer: Reducer<any>,
	rawConfig: any = {},
) {
	const config = new Configuration<T>(rawConfig)

	/**
	 * Logs any graph mutations.
	 */
	function logGraphActions(r: Reducer<any>) {
		return (state: any, action: Action<any>) => {
			const result = r(state, action)
			const newStateGraph = new DagGraph(result.graph)
			log("Action: '%s', State=", action.type, newStateGraph.print())
			return result
		}
	}

	/**
	 * Attempts to handle higher-order dag-history actions.
	 */
	function tryToHandleHistoryAction(
		history: DagHistory<T>,
		action: Action<any>,
	): DagHistory<T> {
		switch (action.type) {
			case config.loadActionType:
				history = DagHistoryImpl.load<T>(action.payload)
				break

			case config.clearActionType:
				history = DagHistoryImpl.clear(history, config)
				break

			case config.undoActionType:
				history = DagHistoryImpl.undo(history)
				break

			case config.redoActionType:
				history = DagHistoryImpl.redo(history)
				break

			case config.jumpToStateActionType:
				history = DagHistoryImpl.jumpToState(action.payload, history)
				break

			case config.jumpToBranchActionType:
				history = DagHistoryImpl.jumpToBranch(action.payload, history)
				break

			case config.jumpToLatestOnBranchActionType:
				history = DagHistoryImpl.jumpToLatestOnBranch(action.payload, history)
				break

			case config.createBranchActionType:
				history = DagHistoryImpl.createBranch(action.payload, history)
				break

			case config.squashActionType:
				history = DagHistoryImpl.squash(history)
				break

			case config.renameBranchActionType:
				history = DagHistoryImpl.renameBranch(
					action.payload.branch,
					action.payload.name,
					history,
				)
				break

			case config.renameStateActionType:
				history = DagHistoryImpl.renameState(
					action.payload.stateId,
					action.payload.name as string,
					history,
				)
				break

			case config.skipToStartActionType:
				history = DagHistoryImpl.skipToStart(history)
				break

			case config.skipToEndActionType:
				history = DagHistoryImpl.skipToEnd(history)
				break

			default:
				if (config.canHandleAction(action)) {
					history = config.handleAction(action, history)
				}
		}

		return history
	}

	function handleBlankState(action: Action<any>) {
		// State is either blank or a non-history object
		const state = reducer(undefined, action)
		const result = DagHistoryImpl.createHistory(state, config)
		log('creating new history with initial state', state, result)
		return result
	}

	function trackHistoryReducer(state: any, action: Action<any> = EMPTY_ACTION) {
		if (!state || !state.graph) {
			return handleBlankState(action)
		}
		const history = tryToHandleHistoryAction(state, action)

		// Pass the event to the client reducer.
		// Clients may be interested in DagHistory events so propagate those to the client reducer as well.
		const newState = reducer(history.current, action)

		let result: DagHistory<T>
		const isActionAllowed = config.actionFilter(action.type)
		const isHistoryHandled = history !== state
		const isReplacement = isHistoryHandled || !isActionAllowed
		log(
			'is action [%s] replacement? %s; allowed=%s, historyHandled=%s',
			action.type,
			isReplacement,
			isActionAllowed,
			isHistoryHandled,
		)
		if (isReplacement) {
			result = DagHistoryImpl.replaceCurrentState(newState, history, config)
		} else {
			// If this is a state we've seen previously, then jump to it.
			const existingState = DagHistoryImpl.getExistingState(
				newState,
				history,
				config,
			)

			return existingState
				? DagHistoryImpl.jumpToStateLogged(existingState, history)
				: DagHistoryImpl.insert(newState, history, config)
		}
		return result
	}

	return config.debug
		? logGraphActions(trackHistoryReducer)
		: trackHistoryReducer
}
