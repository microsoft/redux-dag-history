import { BranchId, StateId } from "./interfaces";
import { Map as ImmutableMap, fromJS as ImmutableFromJS } from "immutable";
const log = require("debug")("redux-dag-history:DagGraph");
const treeify = require("treeify");

export default class DagGraph<T> {
    constructor(public graph: ImmutableMap<any, any>) {
        if (!graph) {
            throw new Error("'graph' parameter must be defined");
        }
        if (!graph.getIn) {
            throw new Error("'graph' must be an immutablejs instance");
        }
    }

    public print(): string {
        const graph = this.graph.toJS();
        let root: any = null;
        const states = {};
        const getOrCreateState = (stateId: StateId) => {
            let result = states[stateId];
            if (!result) {
                result = {
                    id: stateId,
                    name: this.stateName(stateId),
                    children: [] as StateId[],
                };
                states[stateId] = result;
            }
            return result;
        };

        Object.keys(graph.states || {}).forEach(stateId => {
            const parentId = graph.states[stateId].parent;
            const state = getOrCreateState(parseInt(stateId, 10));
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

    public branchStartDepth(branch: BranchId): number {
        return this.stateDepth(this.firstOn(branch));
    }

    public branchEndDepth(branch: BranchId): number {
        return this.stateDepth(this.latestOn(branch));
    }

    public stateDepth(commit: StateId): number {
        return this.commitPath(commit).length - 1;
    }

    public depthIndexOf(branch: BranchId, commit: StateId): number {
        const commits = this.branchCommitPath(branch);
        let foundIndex = commits.indexOf(commit);
        if (foundIndex === -1) {
            return undefined;
        } else {
            const start = this.branchStartDepth(branch);
            return start + foundIndex;
        }
    }

    public get maxDepth(): number {
        const branches = this.branches;
        const branchDepths = branches.map(b => this.branchEndDepth(b));
        let max: number = -1;
        branchDepths.forEach(d => {
            if (d > max) {
                max = d;
            }
        });
        return max;
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
        return this.graph.getIn(["branches", `${branch}`, "latest"]);
    }

    public committedOn(branch: BranchId): StateId {
        return this.graph.getIn(["branches", `${branch}`, "committed"]);
    }

    public setLatest(branch: BranchId, commit: StateId) {
        this.graph = this.graph.setIn(["branches", `${branch}`, "latest"], commit);
        return this;
    }

    public setCommitted(branch: BranchId, commit: StateId) {
        this.graph = this.graph.setIn(["branches", `${branch}`, "committed"], commit);
        return this;
    }

    public markStateForBranch(commit: StateId, branch: BranchId) {
        this.graph = this.graph.setIn(["states", `${commit}`, "branch"], branch);
        return this;
    }

    public setFirst(branch: BranchId, commit: StateId) {
        this.graph = this.graph.setIn(["branches", `${branch}`, "first"], commit);
        return this;
    }

    public firstOn(branch: BranchId): StateId {
        return this.graph.getIn(["branches", `${branch}`, "first"]);
    }

    public renameState(commit: StateId, name: string) {
        this.graph = this.graph.setIn(["states", `${commit}`, "name"], name);
        return this;
    }

    public stateName(commit: StateId) {
        return this.graph.getIn(["states", `${commit}`, "name"]);
    }

    public getBranchName(branch: BranchId): string {
        return this.graph.getIn(["branches", `${branch}`, "name"]);
    }

    public setBranchName(branch: BranchId, name: string) {
        this.graph = this.graph.setIn(["branches", `${branch}`, "name"], name);
        return this;
    }

    public getState(commit: StateId): T {
        return this.graph.getIn(["states", `${commit}`, "state"]);
    }

    public insertState(commit: StateId, parent: StateId, state: T, name: string) {
        log("Inserting new commit", commit);
        const newState = ImmutableFromJS({
            name,
            parent,
        }).set("state", state);
        if (this.graph.getIn(["states", `${commit}`])) {
            log("Commit %s is already present", this.getState(commit));
        }
        this.graph = this.graph.setIn(["states", `${commit}`], newState);
        return this;
    }

    public childrenOf(commit: StateId): StateId[] {
        const states = this.graph.get("states");

        return states.toSeq()
            .filter((state: ImmutableMap<any, any>) => state.get("parent") === commit)
            .map((state: ImmutableMap<any, any>, key: string) => key)
            .toList().toJS().map((s: string) => parseInt(s, 10));
    }

    public parentOf(commit: StateId): StateId {
        return this.graph.getIn(["states", `${commit}`, "parent"]);
    }

    public replaceState(commit: StateId, state: T) {
        this.graph = this.graph.setIn(["states", `${commit}`, "state"], state);
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

    public branchCommitPath(branch: BranchId): StateId[] {
        const latest = this.latestOn(branch);
        const path = this.commitPath(latest);
        const firstCommitOnBranch = this.firstOn(branch);
        return path.slice(path.indexOf(firstCommitOnBranch));
    }

    public setParent(commit: StateId, parent: StateId) {
        this.graph = this.graph.setIn(["states", `${commit}`, "parent"], parent);
    }

    public get branches(): BranchId[] {
        const branches = this.graph.get("branches");
        return Array.from(branches.keys()).map((branch: string) => parseInt(branch, 10));
    }

    public branchOf(commit: StateId): BranchId {
        return this.graph.getIn(["states", `${commit}`, "branch"]);
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

    private remove(commit: StateId) {
        this.graph = this.graph.deleteIn(["states", `${commit}`]);
    }

    public squashCurrentBranch() {
        const toSquash: StateId[] = [];
        const branch = this.branchOf(this.currentStateId);
        let current = this.parentOf(this.currentStateId);
        let keepSquashing = true;

        do {
            if (current && this.branchOf(current) === branch) {
                toSquash.push(current);
                current = this.parentOf(current);
            } else {
                keepSquashing = false;
            }
        } while (keepSquashing);

        log("squashing %s states on branch %s => ", toSquash.length, branch, current, toSquash);
        if (toSquash.length > 0) {
            toSquash.forEach(c => this.remove(c));
            this.setParent(this.currentStateId, current);
        }

        return this;
    }
}
