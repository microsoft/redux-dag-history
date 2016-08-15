const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateNameGenerator,
    StateId,
    BranchId,
    IConfiguration,
} from "./interfaces";
import * as Immutable from "immutable";
import DagGraph from "./DagGraph";

function unfreeze(state: any) {
    return state && state.toJS ? state.toJS() : state;
}

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
        pinnedStateId: null,
        bookmarks: [],
        bookmarkPlaybackIndex: null,
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

export function insert(state: any, history: IDagHistory, config: IConfiguration): IDagHistory {
    log("inserting new history state");
    const { graph, lastBranchId } = history;
    if (!graph) {
        throw new Error("History graph is not defined");
    }
    const reader = new DagGraph(graph);
    const parentStateId = reader.currentStateId;
    const currentBranchId = reader.currentBranch;
    const newStateId = history.lastStateId + 1;
    const newStateName = config.actionName(state, newStateId);

    const cousins = reader.childrenOf(parentStateId);
    const isBranching = cousins.length > 0 || lastBranchId > currentBranchId;
    const newBranchId = isBranching ? lastBranchId + 1 : lastBranchId;

    return Object.assign({}, history, {
        current: state,
        pinnedStateId: null,
        lastStateId: newStateId,
        lastBranchId: newBranchId,
        bookmarkPlaybackIndex: null,
        graph: graph.withMutations(g => {
            let dg = new DagGraph(g)
                .insertState(newStateId, parentStateId, state, newStateName)
                .setCurrentStateId(newStateId);

            if (isBranching) {
                const newBranch = config.branchName(currentBranchId, newBranchId, newStateName);
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

//
// Provides state jumping without special rules applied. This allows us to share common state-jumping code.
//
function jump(stateId: StateId, history: IDagHistory, assignObj = {}, callback: ((g: DagGraph) => void) = () => ({})) {
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

export function jumpToState(stateId: StateId, history: IDagHistory) {
    log("jumping to state %s", stateId);
    const { graph } = history;
    const reader = new DagGraph(graph);
    const branches = reader.branchesOf(stateId);
    const branch = reader.currentBranch;
    const updateObj: any = {
        pinnedStateId: null,
        bookmarkPlaybackIndex: null,
    };
    return jump(stateId, history, updateObj, writer => {
        if (branches.indexOf(branch) === -1) {
            log("current branch %s is not present on commit %s, available are [%s] - setting current branch to null", branch, stateId, branches.join(", "));
            writer.setCurrentBranch(null);
        } else {
            writer.setCommitted(branch, stateId);
        }
    });
}

export function jumpToBranch(branch: BranchId, history: IDagHistory) {
    log("jumping to branch %s", branch);
    const { pinnedStateId, graph } = history;
    const reader = new DagGraph(graph);
    const branches = reader.branches;

    const jumpTo = (state: StateId) => (
        jump(
            state,
            history,
            { bookmarkPlaybackIndex: null },
            writer => writer.setCurrentBranch(branch)
        )
    );

    if (branches.indexOf(branch) === -1) {
        return this.createBranch(branch, history);
    } else if (pinnedStateId) {
        // If a state is pinned, navigate to its successor
        const branchPath = reader.branchCommitPath(branch);
        const childStateIds = branchPath.filter(state => reader.parentOf(state) === pinnedStateId);
        const childStateId = childStateIds.length > 0 ? childStateIds[0] : null;
        if (childStateId) {
            return jumpTo(childStateId);
        }
    }

    return jumpTo(reader.committedOn(branch));
}

export function undo(history: IDagHistory) {
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

export function redo(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);
    const children = reader
        .childrenOf(reader.currentStateId)
        .filter(child => reader.branchesOf(child).indexOf(reader.currentBranch) !== -1);

    if (children.length > 0) {
        const nextStateId = children[0];
        return jumpToState(nextStateId, history);
    } else {
        log("can't redo");
        return history;
    }
}

export function skipToStart(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);

    let result = reader.currentStateId;
    while (reader.parentOf(result) !== null) {
        result = reader.parentOf(result);
    }
    return jumpToState(result, history);
}

export function skipToEnd(history: IDagHistory) {
    const { graph } = history;
    const reader = new DagGraph(graph);

    const path = reader.branchCommitPath(reader.currentBranch);
    const result = path[path.length - 1];
    return jumpToState(result, history);
}

export function createBranch(branchName: string, history: IDagHistory) {
    log("creating branch %s", branchName);
    const { graph, current, lastBranchId } = history;
    const reader = new DagGraph(graph);
    const newBranchId = lastBranchId + 1;

    return Object.assign({}, history, {
        current,
        lastBranchId: newBranchId,
        pinnedStateId: null,
        bookmarkPlaybackIndex: null,
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
        bookmarkPlaybackIndex: null,
        pinnedStateId: null,
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

export function addBookmark(stateId: StateId, history: IDagHistory, config: IConfiguration) {
    log("adding bookmark on state %s", stateId);
    const { graph } = history;
    const reader = new DagGraph(graph);
    const stateName = reader.stateName(stateId);
    const result = Object.assign({}, history);
    result.bookmarks.push({
        stateId: stateId,
        name: config.bookmarkName(stateId, stateName),
        data: {},
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
    log("renaming bookmark %s => %s", bookmarkId, name);
    const result = Object.assign({}, history);
    result.bookmarks.forEach(b => {
        if (b.stateId === bookmarkId) {
            b.name = name;
        }
    });
    return result;
}

export function changeBookmark(bookmarkId: StateId, name: string, data: any, history: IDagHistory) {
    log("changing bookmark data %s", bookmarkId, name, data);
    const result = Object.assign({}, history);
    result.bookmarks.forEach(b => {
        if (b.stateId === bookmarkId) {
            b.name = name;
            b.data = data;
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

export function pinState(stateId: StateId, history: IDagHistory) {
    // Set the pinned state ID
    // set the current state to the pinned state's child in the current branch
    const { graph, pinnedStateId } = history;
    if (pinnedStateId === stateId) {
        log(`unpinning state ${stateId}`);
        // Unpin State
        return Object.assign({}, history, { pinnedStateId: null });
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

    return Object.assign({}, history, {
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
    });
}

function playBackBookmark(rawIndex: number, history: IDagHistory) {
    if (history.bookmarks.length === 0) {
        return history;
    }

    let index = Math.min(
        history.bookmarks.length - 1,
        Math.max(0, rawIndex)
    );
    const stateId = history.bookmarks[index].stateId;
    return jump(stateId, history, {
        pinnedStateId: null,
        bookmarkPlaybackIndex: index,
    });
}

export function playBookmarkStory(history: IDagHistory) {
    return playBackBookmark(0, history);
}

export function skipToFirstBookmark(history: IDagHistory) {
    return playBookmarkStory(history);
}

export function skipToLastBookmark(history: IDagHistory) {
    return playBackBookmark(history.bookmarks.length - 1, history);
}

export function nextBookmark(history: IDagHistory) {
    if (!Number.isInteger(history.bookmarkPlaybackIndex)) {
        return history;
    }
    return playBackBookmark(history.bookmarkPlaybackIndex + 1, history);
}

export function previousBookmark(history: IDagHistory) {
    if (!Number.isInteger(history.bookmarkPlaybackIndex)) {
        return history;
    }
    return playBackBookmark(history.bookmarkPlaybackIndex - 1, history);
}
