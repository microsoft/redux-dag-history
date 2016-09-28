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

export default function skipToEnd(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);

    const path = reader.branchCommitPath(reader.currentBranch);
    const result = path[path.length - 1];
    return jumpToState(result, history);
}
