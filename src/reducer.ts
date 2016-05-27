import { IDagHistory, StateIdGenerator, StateId } from "./interfaces";
import * as ActionTypes from "./ActionTypes";

export interface IConfiguration {
    // Action Types
    moveBackType: string;
    moveForwardType: string;
    jumpType: string;
    clearType: string;

    // Action Filtering
    filter: (actionName: string) => boolean;
    // TODO: limit: number;
}
/*
function createConfiguration(rawConfig): IConfiguration {
    return {
        moveBackType: rawConfig.moveBackType || ActionTypes.UNDO,
        moveForwardType: rawConfig.redoType || ActionTypes.REDO,
        jumpType: rawConfig.jumpType || ActionTypes.JUMP,
        commitType: rawConfig.commitType || ActionTypes.COMMIT,
        clearType: rawConfig.clearType || ActionTypes.CLEAR,
        filter: rawConfig.filter || (() => true),
    };
}

function undo(history: IDagHistory) {
    const {
        current_state: currentStateId,
        current_branch: currentBranch,
        graph: {
          branches,
          states: stateMap
        },
    } = history;
    const currentStateConfig = stateMap[currentStateId];
    const { parent: parentStateId } = currentStateConfig;

    // If we're on the latest state of a branch, roll back the
    if (currentBranch && branches[currentBranch] === currentStateId) {

    }
    return Object.assign({}, jump(parentStateId, history), {

    });
}

function jump(stateId: StateId, history: IDagHistory): IDagHistory {
    if (!stateId) {
        throw new Error(`StateID must be truthy. Found ${stateId}`);
    }
    const { graph: { states } } = history;
    const targetState = states[stateId];
    if (!targetState) {
      throw new Error(`Could not locate state with Id ${stateId}`);
    }
    return {
        current: targetState,
        current_state: stateId,
        current_branch: null,
        graph: history.graph,
    };
}

 * A redux higher-order Reducer for tracking the user's history.
export default function trackHistory(reducer, rawConfig = {}) {
    const config = createConfiguration(rawConfig);

    return function trackHistoryReducer(state, action = {type: undefined}) {
        let history: IDagHistory = state;
        if (!history) {
            history = createHistory(reducer(state));
        }

        switch (action.type) {
            case undefined:
                return state;

            case config.moveBackType:
                return undo(history);

            // case config.redoType:
            // return redo(history);

            case config.jumpType:
                return jump(action["stateId"], history);

            case config.clearType:
                return createHistory(history.current);

            default:
                const newState = reducer(history.current, action);
                history = insert(history, newState);
        }
    };
}
*/
