import { IDagHistory, StateIdGenerator, StateId, IAction } from "./interfaces";
import * as ActionTypes from "./ActionTypes";
import Configuration from "./Configuration";
import * as DagHistory from "./DagHistory";

const EMPTY_ACTION = {
    type: undefined,
    payload: undefined,
} as IAction<{}>;

/**
 * A redux higher-order Reducer for tracking the user's history.
 */
export default function trackHistory(reducer: Function, rawConfig = {}) {
    const config = new Configuration(rawConfig);

    return function trackHistoryReducer(state: any, action: IAction<any> = EMPTY_ACTION) {
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
