const log = require("debug")("redux-dag-history:reducer");
import { IDagHistory, StateIdGenerator, StateId } from "./interfaces";
import { Action }from "redux-actions";
import * as ActionTypes from "./ActionTypes";
import Configuration from "./Configuration";
import * as DagHistory from "./DagHistory";
import DagGraph from "./DagGraph";
import * as Immutable from "immutable";

const EMPTY_ACTION = {
    type: undefined,
    payload: undefined,
} as Action<{}>;

/**
 * A redux higher-order Reducer for tracking the user's history.
 */
export default function trackHistory(reducer: Function, rawConfig = {}) {
    const config = new Configuration(rawConfig);

    function logGraphActions(reducer: any) {
        return (state: any, action: Action<any>) => {
            const result = reducer(state, action);
            const newStateGraph = new DagGraph(result.graph);
            log("Action: '%s', State=", action.type, newStateGraph.print());
            return result;
        };
    }

    function trackHistoryReducer(state: any, action: Action<any> = EMPTY_ACTION) {
        let history: IDagHistory = state;
        if (!history || !history.graph) {
            // State is either blank or a non-history object
            state = reducer(undefined, action);
            const result = DagHistory.createHistory(state, config.initialBranchName, config.initialStateName);
            log("creating new history with initial state", state, result);
            return result;
        }

        switch (action.type) {
            case config.loadActionType:
                return DagHistory.load(action.payload);

            case config.clearActionType:
                return DagHistory.clear(history);

            case config.undoActionType:
                return DagHistory.undo(history);

            case config.redoActionType:
                return DagHistory.redo(history);

            case config.jumpToStateActionType:
                return DagHistory.jumpToState(action.payload, history);

            case config.jumpToBranchActionType:
                return DagHistory.jumpToBranch(action.payload, history);

            case config.createBranchActionType:
                return DagHistory.createBranch(action.payload, history);

            case config.squashActionType:
                return DagHistory.squash(history);

            case config.renameStateActionType:
                return DagHistory.renameState(action.payload.stateId, action.payload.name as string, history);

            case config.addBookmarkActionType:
                return DagHistory.addBookmark(action.payload, history, config);

            case config.removeBookmarkActionType:
                return DagHistory.removeBookmark(action.payload, history);

            case config.renameBookmarkActionType:
                return DagHistory.renameBookmark(action.payload.bookmark, action.payload.name, history);

            case config.moveBookmarkActionType:
                return DagHistory.moveBookmark(action.payload.from, action.payload.to, history);

            case config.pinStateActionType:
                return DagHistory.pinState(action.payload, history);

            case config.skipToStartActionType:
                return DagHistory.skipToStart(history);

            case config.skipToEndActionType:
                return DagHistory.skipToEnd(history);

            default:
                if (config.canHandleAction(action)) {
                    return config.handleAction(action, history);
                } else {
                    const newState = reducer(history.current, action);
                    let result: IDagHistory;
                    const isActionInsertable = config.actionFilter(action.type);
                    log("is action insertable? %s", action.type, isActionInsertable);

                    if (isActionInsertable) {
                        result = DagHistory.insert(newState, history, config);
                    } else {
                        result = DagHistory.replaceCurrentState(newState, history);
                    }
                    return result;
                }
        }
    }

    return config.debug ? logGraphActions(trackHistoryReducer) : trackHistoryReducer;
}
