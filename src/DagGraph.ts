import { BranchId, StateId } from "./interfaces";
import * as Immutable from "immutable";

export class DagGraph {
    constructor(public graph: Immutable.Map<any, any>) {
    }

    public get currentState(): StateId {
        return this.graph.getIn(["current", "state"]);
    }

    public setCurrentState(stateId: StateId) {
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

    public latestOn(branch: BranchId) {
        return this.graph.getIn(["branches", branch, "latest"]);
    }

    public committedOn(branch: BranchId) {
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
        this.graph = this.graph.setIn(["states", commit], Immutable.fromJS({ state, parent, children: [] }));
        return this;
    }

    public getState(commit: StateId) {
        return this.graph.getIn(["states", commit, "state"]);
    }

    public childrenOf(commit: StateId) {
        return this.graph.getIn(["states", commit, "children"]);
    }

    public parentOf(commit: StateId) {
        return this.graph.getIn(["states", commit, "parent"]);
    }

    public addChild(parent: StateId, child: StateId) {
        const children = this.childrenOf(parent);
        this.graph = this.graph.setIn(["states", parent, "children"], children.push(child));
        return this;
    }

    public get branches() {
        const branches = this.graph.get("branches");
        return Array.from(branches.keys());
    }

    public branchesOf(commit: StateId): string[] {
        const children = this.childrenOf(commit);

        if (children.size === 0) {
            const branches = [];
            for (let branch of this.branches) {
                if (this.latestOn(branch) === commit) {
                    branches.push(branch);
                }
            }
            return branches;
        } else {
            return [].concat.apply(children.map(child => this.branchesOf(child)));
        }
    }

    public prune(commits) {
        for (let commit of commits) {
            this.prune(this.childrenOf(commit));
            this.graph.deleteIn(["states", commit]);
        }
        return this;
    }
}
