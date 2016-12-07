import * as Immutable from 'immutable';
import {
  IDagHistory,
  StateIdGenerator,
  StateId,
} from './interfaces';
import { Action }from 'redux-actions';
import * as ActionTypes from './ActionTypes';
import Configuration from './Configuration';
import * as DagHistory from './DagHistory';
import DagGraph from './DagGraph';

const log = require('debug')('redux-dag-history:reducer');

const EMPTY_ACTION = {
  type: undefined,
  payload: undefined,
} as Action<{}>;

/**
 * A redux higher-order Reducer for tracking the user's history.
 */
export default function trackHistory<T>(reducer: Function, rawConfig = {}) {
  const config = new Configuration<T>(rawConfig);

  /**
   * Logs any graph mutations.
   */
  function logGraphActions(reducer: any) {
      return (state: any, action: Action<any>) => {
        const result = reducer(state, action);
        const newStateGraph = new DagGraph(result.graph);
        log('Action: \'%s\', State=', action.type, newStateGraph.print());
        return result;
      };
  }

  /**
   * Attempts to handle higher-order dag-history actions.
   */
  function tryToHandleHistoryAction(history: IDagHistory<T>, action: Action<any>): IDagHistory<T> {
    switch (action.type) {
      case config.loadActionType:
        history = DagHistory.load<T>(action.payload);
        break;

      case config.clearActionType:
        history = DagHistory.clear(history);
        break;

      case config.undoActionType:
        history = DagHistory.undo(history);
        break;

      case config.redoActionType:
        history = DagHistory.redo(history);
        break;

      case config.jumpToStateActionType:
        history = DagHistory.jumpToState(action.payload, history);
        break;

      case config.jumpToBranchActionType:
        history = DagHistory.jumpToBranch(action.payload, history);
        break;

      case config.jumpToLatestOnBranchActionType:
        history = DagHistory.jumpToLatestOnBranch(action.payload, history);
        break;

      case config.createBranchActionType:
        history = DagHistory.createBranch(action.payload, history);
        break;

      case config.renameBranchActionType:
        history = DagHistory.renameBranch(action.payload.branch, action.payload.name, history);
        break;

      case config.squashActionType:
        history = DagHistory.squash(history);
        break;

      case config.renameStateActionType:
        history = DagHistory.renameState(action.payload.stateId, action.payload.name as string, history);
        break;

      case config.addBookmarkActionType:
        history = DagHistory.addBookmark(action.payload, history, config);
        break;

      case config.removeBookmarkActionType:
        history = DagHistory.removeBookmark(action.payload, history);
        break;

      case config.renameBookmarkActionType:
        history = DagHistory.renameBookmark(action.payload.bookmark, action.payload.name, history);
        break;

      case config.changeBookmarkActionType:
        history = DagHistory.changeBookmark(action.payload.bookmark, action.payload.name, action.payload.data, history);
        break;

      case config.moveBookmarkActionType:
        history = DagHistory.moveBookmark(action.payload.from, action.payload.to, history);
        break;

      case config.pinStateActionType:
        history = DagHistory.pinState(action.payload, history);
        break;

      case config.skipToStartActionType:
        history = DagHistory.skipToStart(history);
        break;

      case config.skipToEndActionType:
        history = DagHistory.skipToEnd(history);
        break;

      default:
        if (config.canHandleAction(action)) {
          history = config.handleAction(action, history);
        }
    }

    return history;
  }


  function handleBlankState(action: Action<any>) {
    // State is either blank or a non-history object
    const state = reducer(undefined, action);
    const result = DagHistory.createHistory(state, config.initialBranchName, config.initialStateName);
    log('creating new history with initial state', state, result);
    return result;
  }

  function trackHistoryReducer(state: any, action: Action<any> = EMPTY_ACTION) {
      if (!state || !state.graph) {
        return handleBlankState(action);
      }
      const history = tryToHandleHistoryAction(state, action);

      // Pass the event to the client reducer.
      // Clients may be interested in DagHistory events so propagate those to the client reducer as well.
      const newState = reducer(history.current, action);

      let result: IDagHistory<T>;
      const isActionAllowed = config.actionFilter(action.type);
      const isHistoryHandled = history !== state;
      const isReplacement = isHistoryHandled || !isActionAllowed;
      log('is action [%s] replacement? %s; allowed=%s, historyHandled=%s',
        action.type,
        isReplacement,
        isActionAllowed,
        isHistoryHandled
      );
      if (isReplacement) {
        result = DagHistory.replaceCurrentState(newState, history, config);
      } else {
        // If this is a state we've seen previously, then jump to it.
        const existingState = DagHistory.getExistingState(newState, history, config);
        if (existingState) {
          result = DagHistory.jumpToStateLogged(existingState, history);
        } else {
          result = DagHistory.insert(newState, history, config);
        }
      }
      return result;
  }

  return config.debug ? logGraphActions(trackHistoryReducer) : trackHistoryReducer;
}
