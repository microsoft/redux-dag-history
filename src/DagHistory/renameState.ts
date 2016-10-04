const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from "immutable";

export default function renameState<T>(stateId: StateId, name: string, history: IDagHistory<T>) {
    log("rename state %s => %s", stateId, name);
    const { graph } = history;
    return Object.assign({}, history, {
        current: history.current,
        graph: graph.withMutations(g => new DagGraph(g).renameState(stateId, name)),
    });
}
