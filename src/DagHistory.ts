import {
    IDagHistory,
    StateIdGenerator,
    StateId,
    BranchId,
} from "./interfaces";
import * as Immutable from "immutable";
import { DagGraph } from "./DagGraph";

let lastStateId = 0;
function defaultStateIdGenerator() {
    return `${++lastStateId}`;
}

export function createHistory(appState = {}, generateNextId: StateIdGenerator = defaultStateIdGenerator): IDagHistory {
    const currentStateId = generateNextId();
    return {
        current: appState,
        graph: Immutable.fromJS({
            current: {
                state: currentStateId,
                branch: "master",
            },
            branches: {
              "master": {
                latest: currentStateId,
                committed: currentStateId,
              },
            },
            states: {
                [currentStateId]: {
                    state: appState,
                    parent: null,
                    children: [],
                }
            },
        }),
    };
}

export function insert(state: any, history: IDagHistory, generateNextId: StateIdGenerator = defaultStateIdGenerator): IDagHistory {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const parentStateId = reader.currentStateId;
    const currentBranch = reader.currentBranch;
    const newStateId = generateNextId();

    // TODO: Prune Orphaned children of parent. Reset branch latest
    const cousins = reader.childrenOf(parentStateId);
    const cousinsToPrune = cousins.filter(cousin => (reader.branchesOf(cousin)).length === 0);

    return {
        current: state,
        graph: graph.withMutations(g => {
            new DagGraph(g)
                .insertState(newStateId, parentStateId, state)
                .setCurrentStateId(newStateId)
                .prune(cousinsToPrune.toJS())
                .addChild(parentStateId, newStateId)
                .setLatest(currentBranch, newStateId)
                .setCommitted(currentBranch, newStateId);
        }),
    };
}

export function jumpToState(stateId: StateId, history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const branches = reader.branchesOf(stateId);
    const branch = reader.currentBranch;

    return {
        current: reader.getState("stateId"),
        graph: graph.withMutations(g => {
            const writer = new DagGraph(g).setCurrentStateId(stateId);
            if (branches.indexOf(branch) !== -1) {
                writer.setCurrentBranch(null);
            }
        }),
    };
}

export function jumpToBranch(branch: BranchId, history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const branchCommitId = reader.committedOn(branch);
    const branches = reader.branchesOf(branchCommitId);

    return {
        current: reader.getState(branchCommitId),
        graph: graph.withMutations(g => {
            new DagGraph(g)
                .setCurrentStateId(branchCommitId)
                .setCurrentBranch(branches.indexOf(branch) !== -1 ? branch : null);
        }),
    };
}

export function undo(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const parentId = reader.parentOf(reader.currentStateId);

    return {
        current: reader.getState(parentId),
        graph: graph.withMutations(g => {
            const writer = new DagGraph(g);
                writer.setCurrentStateId(parentId);
                if (reader.currentBranch) {
                    writer.setCommitted(reader.currentBranch, parentId);
                }
        }),
    };
}

export function redo(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const children = reader
        .childrenOf(reader.currentStateId)
        .filter(child => reader.branchesOf(child).indexOf(reader.currentBranch) !== -1);

    if (children.size > 0) {
        // TODO: throw an error or something if children.size > 1
        const child = children.get(0);
        return {
            current: reader.getState(child),
            graph: graph.withMutations(g => {
                new DagGraph(g).setCommitted(reader.currentBranch, child);
            }),
        };
    } else {
        return history;
    }
}

export function createBranch(branchId: BranchId, history: IDagHistory) {
    const { graph, current } = history;
    const reader = new DagGraph(graph);

    return {
        current,
        graph: graph.withMutations(g => {
            new DagGraph(g)
                .setCurrentBranch(branchId)
                .setCommitted(branchId, reader.currentStateId)
                .setLatest(branchId, reader.currentStateId);
        }),
    };
}

export function clear(history: IDagHistory) {
    const { graph, current } = history;
    return createHistory(current);
}

export function squash(history: IDagHistory) {
    const { graph, current } = history;
    return {
        current,
        graph: graph.withMutations(g => {
            new DagGraph(g)
                .squashCurrentBranch();
        });
    };
}
