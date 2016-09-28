/// <reference path="../../node_modules/typescript/lib/lib.es2017.d.ts" />
const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateNameGenerator,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import * as Immutable from "immutable";
import DagGraph from "../DagGraph";
import unfreeze from './unfreeze';

//
// Provides state jumping without special rules applied. This allows us to share common state-jumping code.
//
export default function jump(stateId: StateId, history: IDagHistory, assignObj = {}, callback: ((g: DagGraph) => void) = () => ({})) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const targetState = reader.getState(stateId);

    return Object.assign({}, history, assignObj, {
        current: unfreeze(targetState),
        graph: graph.withMutations(g => {
            const writer = new DagGraph(g)
                .setCurrentStateId(stateId);
            callback(writer);
        }),
    });
}