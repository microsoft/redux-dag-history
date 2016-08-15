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

        let isHistoryHandled = false;

        switch (action.type) {
            case config.loadActionType:
                history = DagHistory.load(action.payload);
                isHistoryHandled = true;
                break;

            case config.clearActionType:
                history = DagHistory.clear(history);
                isHistoryHandled = true;
                break;

            case config.undoActionType:
                history = DagHistory.undo(history);
                isHistoryHandled = true;
                break;

            case config.redoActionType:
                history = DagHistory.redo(history);
                isHistoryHandled = true;
                break;

            case config.jumpToStateActionType:
                history = DagHistory.jumpToState(action.payload, history);
                isHistoryHandled = true;
                break;

            case config.jumpToBranchActionType:
                history = DagHistory.jumpToBranch(action.payload, history);
                isHistoryHandled = true;
                break;

            case config.createBranchActionType:
                history = DagHistory.createBranch(action.payload, history);
                isHistoryHandled = true;
                break;

            case config.squashActionType:
                history = DagHistory.squash(history);
                isHistoryHandled = true;
                break;

            case config.renameStateActionType:
                history = DagHistory.renameState(action.payload.stateId, action.payload.name as string, history);
                isHistoryHandled = true;
                break;

            case config.addBookmarkActionType:
                history = DagHistory.addBookmark(action.payload, history, config);
                isHistoryHandled = true;
                break;

            case config.removeBookmarkActionType:
                history = DagHistory.removeBookmark(action.payload, history);
                isHistoryHandled = true;
                break;

            case config.renameBookmarkActionType:
                history = DagHistory.renameBookmark(action.payload.bookmark, action.payload.name, history);
                isHistoryHandled = true;
                break;

            case config.changeBookmarkActionType:
                history = DagHistory.changeBookmark(action.payload.bookmark, action.payload.name, action.payload.data, history);
                isHistoryHandled = true;
                break;

            case config.moveBookmarkActionType:
                history = DagHistory.moveBookmark(action.payload.from, action.payload.to, history);
                isHistoryHandled = true;
                break;

            case config.pinStateActionType:
                history = DagHistory.pinState(action.payload, history);
                isHistoryHandled = true;
                break;

            case config.skipToStartActionType:
                history = DagHistory.skipToStart(history);
                isHistoryHandled = true;
                break;

            case config.skipToEndActionType:
                history = DagHistory.skipToEnd(history);
                isHistoryHandled = true;
                break;

            case config.playBookmarkStoryActionType:
                history = DagHistory.playBookmarkStory(history);
                isHistoryHandled = true;
                break;

            case config.skipToFirstBookmarkActionType:
                history = DagHistory.skipToFirstBookmark(history);
                isHistoryHandled = true;
                break;

            case config.skipToLastBookmarkActionType:
                history = DagHistory.skipToLastBookmark(history);
                isHistoryHandled = true;
                break;

            case config.nextBookmarkActionType:
                history = DagHistory.nextBookmark(history);
                isHistoryHandled = true;
                break;

            case config.previousBookmarkActionType:
                history = DagHistory.previousBookmark(history);
                isHistoryHandled = true;
                break;

            default:
                if (config.canHandleAction(action)) {
                    history = config.handleAction(action, history);
                    isHistoryHandled = true;
                }
        }

        //
        // Pass the event to the inner reducer. They may be interested in DagHistory events
        // so propaget those to the inner reducer as well.
        //
        const newState = reducer(history.current, action);
        let result: IDagHistory;
        const isActionAllowed = config.actionFilter(action.type);
        const isInsertable  = isActionAllowed && !isHistoryHandled;
        log("is action [%s] insertable? %s; allowed=%s, historyHandled=%s",
            action.type,
            isInsertable,
            isActionAllowed,
            isHistoryHandled
        );
        if (!isHistoryHandled && isActionAllowed) {
            result = DagHistory.insert(newState, history, config);
        } else {
            result = DagHistory.replaceCurrentState(newState, history);
        }
        return result;
    }

    return config.debug ? logGraphActions(trackHistoryReducer) : trackHistoryReducer;
}
