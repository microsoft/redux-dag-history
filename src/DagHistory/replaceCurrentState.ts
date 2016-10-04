const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from "immutable";

export default function replaceCurrentState<T>(state: any, history: IDagHistory<T>) {
    log("replace current state");
    const { graph } = history;
    const reader = new DagGraph(graph);
    const currentStateId = reader.currentStateId;
    return Object.assign({}, history, {
        current: state,
        graph: graph.withMutations(g => new DagGraph(g).replaceState(currentStateId, state)),
    });
}
