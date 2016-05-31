import { IDagHistory, StateIdGenerator, StateId } from "./interfaces";
import * as ActionTypes from "./ActionTypes";
import Configuration from "./Configuration";
import * as DagHistory from "./DagHistory";

/**
 * A redux higher-order Reducer for tracking the user's history.
 */
export default function trackHistory(reducer, rawConfig = {}) {
    const config = new Configuration(rawConfig);

    return function trackHistoryReducer(state, action = {type: undefined, payload: undefined}) {
        let history: IDagHistory = state;
        if (!history) {
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
                history = DagHistory.insert(newState, history);
        }
    };
}
