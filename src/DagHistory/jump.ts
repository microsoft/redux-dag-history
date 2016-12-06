const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateNameGenerator,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from "immutable";
import DagGraph from "../DagGraph";
import unfreeze from "./unfreeze";

//
// Provides state jumping without special rules applied. This allows us to share common state-jumping code.
//


/**
 * Jumps to a specific state, while logging this visitation in the chronological states array.
 */
export function jumpLog<T>(
    stateId: StateId,
    history: IDagHistory<T>,
    assignObj = {},
    callback: ((g: DagGraph<T>) => void
) = () => ({})): IDagHistory<T> {
    const { chronologicalStates } = history;
    const result = jump(stateId, history, assignObj, callback);
    return {
        ...result,
        chronologicalStates: [
            ...chronologicalStates,
            stateId,
        ],
    };
}

/**
 * Jumps to a specific state
 */
export function jump<T>(
    stateId: StateId,
    history: IDagHistory<T>,
    assignObj = {},
    callback: ((g: DagGraph<T>) => void
) = () => ({})): IDagHistory<T> {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const targetState = reader.getState(stateId);
    return {
        ...history,
        ...assignObj,
        current: unfreeze(targetState),
        graph: graph.withMutations(g => {
            const writer = new DagGraph<T>(g).setCurrentStateId(stateId);
            callback(writer);
        }),
    };
}
