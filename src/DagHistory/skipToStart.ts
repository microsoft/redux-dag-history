const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import jumpToState from './jumpToState';
import * as Immutable from 'immutable';

export default function skipToStart(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);

    let result = reader.currentStateId;
    while (reader.parentOf(result) !== null) {
        result = reader.parentOf(result);
    }
    return jumpToState(result, history);
}
