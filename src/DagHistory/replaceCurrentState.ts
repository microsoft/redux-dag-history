const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from "immutable";

export default function replaceCurrentState<T>(state: any, history: IDagHistory<T>, config: IConfiguration<T>): IDagHistory<T> {
    log("replace current state");
    const { graph, stateHash } = history;
    const reader = new DagGraph(graph);
    const currentStateId = reader.currentStateId;

    // If the state has a hash code, register the state
    if (config.stateKeyGenerator) {
        const stateHash = config.stateKeyGenerator(state);

        log("inserting state with key", stateHash);
        history.stateHash.set(stateHash, currentStateId);
    }

    return {
        ...history,
        current: state,
        stateHash,
        graph: graph.withMutations(g => new DagGraph(g).replaceState(currentStateId, state)),
    };
}
