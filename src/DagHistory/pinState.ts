const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import unfreeze from "./unfreeze";

export default function pinState<T>(stateId: StateId, history: IDagHistory<T>): IDagHistory<T> {
    // Set the pinned state ID
    // set the current state to the pinned state"s child in the current branch
    const { graph, pinnedStateId } = history;
    if (pinnedStateId === stateId) {
        log(`unpinning state ${stateId}`);
        // Unpin State
        return {
            ...history,
            pinnedStateId: null,
        };
    }

    log(`pinning state:: ${stateId}`);

    const reader = new DagGraph(graph);
    const { currentBranch } = reader;

    const children = reader.childrenOf(stateId);
    const child = children.map(child => ({
        state: child,
        branch: reader.branchOf(child),
    })).filter(result => result.branch === currentBranch);

    const targetStateId = children.length === 0 ? stateId : child.length > 0 ? child[0].state : children[0];

    const branches = reader.branchesOf(stateId);
    const branch = reader.currentBranch;
    const targetState = reader.getState(targetStateId);

    return {
        ...history,
        pinnedStateId: stateId,
        current: unfreeze(targetState),
        graph: graph.withMutations(g => {
            const writer = new DagGraph(g)
                .setCurrentStateId(targetStateId);

            if (branches.indexOf(branch) === -1) {
                log("current branch %s is not present on commit %s, available are [%s] - setting current branch to null", branch, stateId, branches.join(", "));
                writer.setCurrentBranch(null);
            }
        }),
    };
}
