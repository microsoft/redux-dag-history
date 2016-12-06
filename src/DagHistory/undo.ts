const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateNameGenerator,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import DagGraph from "../DagGraph";
import jumpToState from "./jumpToState";
import * as Immutable from "immutable";

export default function undo<T>(history: IDagHistory<T>): IDagHistory<T> {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const parentId = reader.parentOf(reader.currentStateId);
    if (parentId !== null && parentId !== undefined) {
        log("undoing %s => %s", reader.currentStateId, parentId);
        return jumpToState(parentId, history);
    } else {
        log("cannot undo");
        return history;
    }
}
