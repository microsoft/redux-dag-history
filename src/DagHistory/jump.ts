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
export function jumpLog<T>(
    stateId: StateId,
    history: IDagHistory<T>,
    assignObj = {},
    callback: ((g: DagGraph<T>) => void
) = () => ({})) {
    const { chronologicalStates } = history;
    const result = jump(stateId, history, assignObj, callback);
    return Object.assign(result, {
        chronologicalStates: [...chronologicalStates, stateId],
    });
}

export function jump<T>(
    stateId: StateId,
    history: IDagHistory<T>,
    assignObj = {},
    callback: ((g: DagGraph<T>) => void
) = () => ({})) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const targetState = reader.getState(stateId);

    return Object.assign({}, history, assignObj, {
        current: unfreeze(targetState),
        graph: graph.withMutations(g => {
            const writer = new DagGraph<T>(g).setCurrentStateId(stateId);
            callback(writer);
        }),
    });
}
