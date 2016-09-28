const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from 'immutable';

export default function squash(history: IDagHistory) {
    log("squashing history");
    const { graph, current } = history;
    return Object.assign({}, history, {
        current,
        bookmarkPlaybackIndex: null,
        pinnedStateId: null,
        graph: graph.withMutations(g => new DagGraph(g).squashCurrentBranch()),
    });
}