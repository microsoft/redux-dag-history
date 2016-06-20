const log = require("debug")("redux-dag-history:DagGraph");
import { BranchId, StateId } from "./interfaces";
import * as Immutable from "immutable";
const treeify = require("treeify");

export default class DagGraph {
    constructor(public graph: Immutable.Map<any, any>) {
        if (!graph) {
            throw new Error("'graph' parameter must be defined");
        }
        if (!graph.getIn) {
            throw new Error("'graph' appears to not be an immutablejs instance");
        }
    }

    public print() {
        const graph = this.graph.toJS();
        let root: any = null;
        const states = {};
        const getOrCreateState = (stateId: string) => {
            let result = states[stateId];
            if (!result) {
                result = {id: stateId, children: [] as any};
                states[stateId] = result;
            }
            return result;
        }

        Object.keys(graph.states || {}).forEach(stateId => {
            const parentId = graph.states[stateId].parent;
            const state = getOrCreateState(stateId);
            if (!parentId) {
                root = state;
            }
            getOrCreateState(parentId).children.push(state);
            states[stateId] = state;

        });

        const tree = {
            current: graph.current,
            branches: graph.branches,
            // states: graph.states,
            dag: root,
        };
        const result = treeify.asTree(tree, true);
        return result;
    }

    public get currentStateId(): StateId {
        return this.graph.getIn(["current", "state"]);
    }

    public setCurrentStateId(stateId: StateId) {
        this.graph = this.graph.setIn(["current", "state"], stateId);
        return this;
    }

    public get currentBranch(): BranchId {
        return this.graph.getIn(["current", "branch"]);
    }

    public setCurrentBranch(branchId: BranchId) {
        this.graph = this.graph.setIn(["current", "branch"], branchId);
        return this;
    }

    public latestOn(branch: BranchId): StateId {
        return this.graph.getIn(["branches", branch, "latest"]);
    }

    public committedOn(branch: BranchId): StateId {
        return this.graph.getIn(["branches", branch, "committed"]);
    }

    public setLatest(branch: BranchId, commit: StateId) {
        this.graph = this.graph.setIn(["branches", branch, "latest"], commit);
        return this;
    }

    public setCommitted(branch: BranchId, commit: StateId) {
        this.graph = this.graph.setIn(["branches", branch, "committed"], commit);
        return this;
    }

    public insertState(commit: StateId, parent: StateId, state: any) {
        const newState = Immutable.fromJS({
            state,
            parent,
        });
        this.graph = this.graph.setIn(["states", commit], newState);
        return this;
    }

    public getState(commit: StateId) {
        return this.graph.getIn(["states", commit, "state"]);
    }

    public childrenOf(commit: StateId): StateId[] {
        const states = this.graph.get("states");

        return states.toSeq()
            .filter((state: Immutable.Map<any, any>) => state.get("parent") === commit)
            .map((state: Immutable.Map<any, any>, key: string) => key)
            .toList().toJS();
    }

    public parentOf(commit: StateId): StateId {
        return this.graph.getIn(["states", commit, "parent"]);
    }

    public replaceState(commit: StateId, state: any) {
        this.graph = this.graph.setIn(["states", commit, "state"], state);
        return this;
    }

    public commitPath(commit: StateId): StateId[] {
        const path: StateId[] = [commit];
        let current = commit;
        do {
            const parent = this.parentOf(current);
            if (parent) {
                path.unshift(parent);
            }
            current = parent;
        } while (current);
        return path;
    }

    public setParent(commit: StateId, parent: StateId) {
        this.graph = this.graph.setIn(["states", commit, "parent"], parent);
    }

    public get branches(): BranchId[] {
        const branches = this.graph.get("branches");
        return Array["from"](branches.keys());
    }

    public branchesOf(commit: StateId): BranchId[] {
        if (!commit) {
            throw new Error("commit must be defined");
        }
        const children = this.childrenOf(commit);
        if (children.length === 0) {
            const branches: BranchId[] = [];
            for (let branch of this.branches) {
                if (this.latestOn(branch) === commit) {
                    branches.push(branch);
                }
            }
            return branches;
        } else {
            let result: BranchId[] = [];
            let childrenBranches = children.map(child => this.branchesOf(child));
            childrenBranches.forEach(cb => result = result.concat(...cb));
            return result;
        }
    }

    public prune(commits: StateId[]) {
        for (let commit of commits) {
            // Prune Children
            this.prune(this.childrenOf(commit));
            this.remove(commit);
        }
        return this;
    }

    private remove(commit: StateId) {
        this.graph.deleteIn(["states", commit]);
    }

    public squashCurrentBranch() {
        const toSquash: StateId[] = [];
        let current = this.parentOf(this.currentStateId);
        let numBranches: number;

        if (current) {
            do {
                // If there is a single branch in the parent, it's squashable
                const branches = this.branchesOf(current);
                numBranches = current ? branches.length : 0;
                if (numBranches === 1) {
                    toSquash.push(current);
                }
                current = this.parentOf(current);
            } while (current && numBranches === 1);
        }

        if (toSquash.length > 0) {
            toSquash.forEach(c => this.remove(c));
            this.setParent(this.currentStateId, current);
        }

        return this;
    }
}
