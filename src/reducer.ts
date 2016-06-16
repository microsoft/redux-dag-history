const log = require("debug")("redux-dag-history:reducer");
import { IDagHistory, StateIdGenerator, StateId } from "./interfaces";
import { Action }from "redux-actions";
import * as ActionTypes from "./ActionTypes";
import Configuration from "./Configuration";
import * as DagHistory from "./DagHistory";

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
            const newStateGraph = result.graph;
            const oldStateGraph = state && state.graph ? state.graph : null;
            log("Action: '%s'\n%s\n%s", action.type, oldStateGraph, newStateGraph);
            return result;
        };
    }

    function trackHistoryReducer(state: any, action: Action<any> = EMPTY_ACTION) {
        let history: IDagHistory = state;
        if (!history || !history.graph) {
            log("history not present; creating new DagHistory");
            history = DagHistory.createHistory(state);
        }

        switch (action.type) {
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

            default:
                const newState = reducer(history.current, action);
                if (config.actionFilter(action.type)) {
                    return DagHistory.insert(newState, history);
                } else {
                    return DagHistory.replaceCurrentState(newState, history);
                }
        }
    }

    return config.debug ? logGraphActions(trackHistoryReducer) : trackHistoryReducer;
}
