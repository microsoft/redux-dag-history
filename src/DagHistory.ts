const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateNameGenerator,
    StateId,
    BranchId,
} from "./interfaces";
import * as Immutable from "immutable";
import DagGraph from "./DagGraph";

export function load(history: any) {
    return Object.assign({}, history, { graph: Immutable.fromJS(history.graph) });
}

export function createHistory(
    initialState = {},
    initialBranchName: string = "1: Initial",
    initialStateName: string = "Initial"
): IDagHistory {
    log("creating history");
    const currentStateId = 1;
    const currentBranchId = 1;
    const currentBookmarkId = 0;
    return load({
        current: initialState,
        lastStateId: currentStateId,
        lastBranchId: currentBranchId,
        bookmarks: [],
        graph: {
            current: {
                state: currentStateId,
                branch: currentBranchId,
            },
            branches: {
                [currentBranchId]: {
                latest: currentStateId,
                name: initialBranchName,
                first: currentStateId,
                committed: currentStateId,
                },
            },
            states: {
                [currentStateId]: {
                    state: initialState,
                    name: initialStateName,
                    branch: 1,
                    parent: null
                },
            },
        },
    });
}

export function insert(state: any, history: IDagHistory, getStateName: StateNameGenerator): IDagHistory {
    log("inserting new history state");
    const { graph, lastBranchId } = history;
    if (!graph) {
        throw new Error("History graph is not defined");
    }
    const reader = new DagGraph(graph);
    const parentStateId = reader.currentStateId;
    const currentBranchId = reader.currentBranch;
    const newStateId = history.lastStateId + 1;
    const newStateName = getStateName(state, newStateId);

    const cousins = reader.childrenOf(parentStateId);
    const isBranching = cousins.length > 0 || lastBranchId > currentBranchId;
    const newBranchId = isBranching ? lastBranchId + 1 : lastBranchId;

    return Object.assign({}, history, {
        current: state,
        lastStateId: newStateId,
        lastBranchId: newBranchId,
        graph: graph.withMutations(g => {
            let dg = new DagGraph(g)
                .insertState(newStateId, parentStateId, state, newStateName)
                .setCurrentStateId(newStateId);

            if (isBranching) {
                const newBranch = dg.newBranchName(currentBranchId, newBranchId, newStateName);
                dg.setCurrentBranch(newBranchId)
                  .setBranchName(newBranchId, newBranch)
                  .setLatest(newBranchId, newStateId)
                  .setFirst(newBranchId, newStateId)
                  .setCommitted(newBranchId, newStateId)
                  .markStateForBranch(newStateId, newBranchId);
            } else {
                dg.setLatest(currentBranchId, newStateId)
                  .setCommitted(currentBranchId, newStateId)
                  .markStateForBranch(newStateId, currentBranchId);
            }
        }),
    });
}

export function jumpToState(stateId: StateId, history: IDagHistory) {
    log("jumping to state %s", stateId);
    const { graph } = history;
    const reader = new DagGraph(graph);
    const branches = reader.branchesOf(stateId);
    const branch = reader.currentBranch;
    return Object.assign({}, history, {
        current: reader.getState(stateId).toJS(),
        graph: graph.withMutations(g => {
            const writer = new DagGraph(g)
                .setCurrentStateId(stateId);

            if (branches.indexOf(branch) === -1) {
                log("current branch %s is not present on commit %s, available are [%s] - setting current branch to null", branch, stateId, branches.join(", "));
                writer.setCurrentBranch(null);
            } else {
                writer.setCommitted(branch, stateId);
            }
        }),
    });
}

export function jumpToBranch(branch: BranchId, history: IDagHistory) {
    log("jumping to branch %s", branch);
    const { graph } = history;
    const reader = new DagGraph(graph);
    const branches = reader.branches;
    if (branches.indexOf(branch) === -1) {
        return this.createBranch(branch, history);
    } else {
        const branchCommitId = reader.committedOn(branch);
        return Object.assign({}, history, {
            current: reader.getState(branchCommitId).toJS(),
            graph: graph.withMutations(g => {
                new DagGraph(g)
                    .setCurrentStateId(branchCommitId)
                    .setCurrentBranch(branch);
            }),
        });
    }
}

export function undo(history: IDagHistory) {
    log("undoing");
    const { graph } = history;
    const reader = new DagGraph(graph);
    const parentId = reader.parentOf(reader.currentStateId);

    return Object.assign({}, history, {
        current: reader.getState(parentId).toJS(),
        graph: graph.withMutations(g => {
            const writer = new DagGraph(g);
                writer.setCurrentStateId(parentId);
                if (reader.currentBranch) {
                    writer.setCommitted(reader.currentBranch, parentId);
                }
        }),
    });
}

export function redo(history: IDagHistory) {
    log("redoing");
    const { graph } = history;
    const reader = new DagGraph(graph);
    const children = reader
        .childrenOf(reader.currentStateId)
        .filter(child => reader.branchesOf(child).indexOf(reader.currentBranch) !== -1);

    if (children.length > 0) {
        // TODO: throw an error or something if children.size > 1
        const child = children[0];
        return Object.assign({}, history, {
            current: reader.getState(child).toJS(),
            graph: graph.withMutations(g => {
                new DagGraph(g).setCommitted(reader.currentBranch, child);
            }),
        });
    } else {
        return history;
    }
}

export function createBranch(branchName: string, history: IDagHistory) {
    log("creating branch %s", branchName);
    const { graph, current, lastBranchId } = history;
    const reader = new DagGraph(graph);

    const newBranchId = lastBranchId + 1;

    return Object.assign({}, history, {
        current,
        lastBranchId: newBranchId,
        graph: graph.withMutations(g => {
            new DagGraph(g)
                .setCurrentBranch(newBranchId)
                .setBranchName(newBranchId, branchName)
                .setCommitted(newBranchId, reader.currentStateId)
                .setFirst(newBranchId, reader.currentStateId)
                .setLatest(newBranchId, reader.currentStateId);
        }),
    });
}

export function clear(history: IDagHistory) {
    log("clearing history");
    const { graph, current } = history;
    return createHistory(current);
}

export function squash(history: IDagHistory) {
    log("squashing history");
    const { graph, current } = history;
    return Object.assign({}, history, {
        current,
        graph: graph.withMutations(g => new DagGraph(g).squashCurrentBranch()),
    });
}

export function replaceCurrentState(state: any, history: IDagHistory) {
    log("replace current state");
    const { graph } = history;
    const reader = new DagGraph(graph);
    const currentStateId = reader.currentStateId;
    return Object.assign({}, history, {
        current: state,
        graph: graph.withMutations(g => new DagGraph(g).replaceState(currentStateId, state)),
    });
}

export function renameState(stateId: StateId, name: string, history: IDagHistory) {
    log("rename state %s => %s", stateId, name);
    const { graph } = history;
    return Object.assign({}, history, {
        current: history.current,
        graph: graph.withMutations(g => new DagGraph(g).renameState(stateId, name)),
    });
}

export function addBookmark(stateId: StateId, history: IDagHistory) {
    log("adding bookmark on state %s", stateId);
    const result = Object.assign({}, history);
    result.bookmarks.push({
        stateId: stateId,
        name: `Bookmark ${history.bookmarks.length + 1}`
    });
    return result;
}

export function removeBookmark(stateId: StateId, history: IDagHistory) {
    log("removing bookmark for state %s", stateId);
    const result = Object.assign({}, history) as IDagHistory;
    result.bookmarks = history.bookmarks.filter((element) => element.stateId !== stateId);
    return result;
}

export function renameBookmark(bookmarkId: StateId, name: string, history: IDagHistory) {
    log("renaming bookmark %s", bookmarkId);
    const result = Object.assign({}, history);
    result.bookmarks.forEach(b => {
        if (b.stateId === bookmarkId) {
            b.name = name;
        }
    });
    return result;
}

export function moveBookmark(from: number, to: number, history: IDagHistory) {
    log("moving bookmark at %s to %s", from, to);
    const result = Object.assign({}, history);
    if (from < to) {
        to--;
    }
    result.bookmarks.splice(to, 0, result.bookmarks.splice(from, 1)[0]);
    return result;
}
