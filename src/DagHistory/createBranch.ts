const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from "immutable";

export default function createBranch<T>(branchName: string, history: IDagHistory<T>) {
    log("creating branch %s", branchName);
    const { graph, current, lastBranchId } = history;
    const reader = new DagGraph(graph);
    const newBranchId = lastBranchId + 1;

    return Object.assign({}, history, {
        current,
        lastBranchId: newBranchId,
        pinnedStateId: null,
        bookmarkPlaybackIndex: null,
        graph: graph.withMutations(g => {
            new DagGraph(g)
                .setCurrentBranch(newBranchId)
                .setBranchName(newBranchId, branchName)
                .setCommitted(newBranchId, reader.currentStateId)
                .setFirst(newBranchId, reader.currentStateId)
                .setLatest(newBranchId, reader.currentStateId);
        }),
    });
}
