/// <reference path="../../node_modules/typescript/lib/lib.es2017.d.ts" />
const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import DagGraph from "../DagGraph";

/**
 * Inserts a new state into the history
 */
export default function insert<T>(state: T, history: IDagHistory<T>, config: IConfiguration<T>): IDagHistory<T> {
    log("inserting new history state");
    const { graph, lastBranchId, chronologicalStates } = history;
    if (!graph) {
        throw new Error("History graph is not defined");
    }
    const reader = new DagGraph(graph);
    const parentStateId = reader.currentStateId;
    const currentBranchId = reader.currentBranch;
    const newStateId = history.lastStateId + 1;
    const newStateName = config.actionName(state, newStateId);
    const cousins = reader.childrenOf(parentStateId);
    const isBranching = cousins.length > 0 || lastBranchId > currentBranchId;
    const newBranchId = isBranching ? lastBranchId + 1 : lastBranchId;

    // If the state has a hash code, register the state
    if (config.stateKeyGenerator) {
        const stateHash = config.stateKeyGenerator(state);
        log("inserting state with key", stateHash);
        history.stateHash.set(stateHash, newStateId);
    }

    return Object.assign({}, history, {
        current: state,
        pinnedStateId: null,
        lastStateId: newStateId,
        lastBranchId: newBranchId,
        bookmarkPlaybackIndex: null,
        chronologicalStates: [...chronologicalStates, newStateId],
        graph: graph.withMutations(g => {
            let dg = new DagGraph(g)
                .insertState(newStateId, parentStateId, state, newStateName)
                .setCurrentStateId(newStateId);

            if (isBranching) {
                const newBranch = config.branchName(currentBranchId, newBranchId, newStateName);
                dg.setCurrentBranch(newBranchId)
                  .setBranchName(newBranchId, newBranch)
                  .setLatest(newBranchId, newStateId)
                  .setFirst(newBranchId, newStateId)
                  .setCommitted(newBranchId, newStateId)
                  .markStateForBranch(newStateId, newBranchId);
            } else {
                dg.setLatest(currentBranchId, newStateId)
                  .setCommitted(currentBranchId, newStateId)
                  .markStateForBranch(newStateId, currentBranchId);
            }
        }),
    });
}
