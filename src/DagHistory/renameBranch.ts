const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from 'immutable';

export default function renameBranch(branchId: BranchId, branchName: string, history: IDagHistory) {
    const { graph } = history;
    log("renaming branch %s: '%s'", branchId, branchName);
    return Object.assign({}, history, {
        graph: graph.withMutations(g => {
            new DagGraph(g).setBranchName(branchId, branchName);
        }),
    });
}