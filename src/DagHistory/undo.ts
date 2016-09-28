const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateNameGenerator,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import DagGraph from "../DagGraph";
import jumpToState from './jumpToState';
import * as Immutable from 'immutable';

export default function undo(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const parentId = reader.parentOf(reader.currentStateId);
    if (parentId !== null && parentId !== undefined) {
        log("undoing %s => %s", reader.currentStateId, parentId);
        return jumpToState(parentId, history);
    } else {
        log("can't undo");
        return history;
    }
}