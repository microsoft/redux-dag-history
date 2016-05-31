import { BranchId, StateId } from "./interfaces";
import * as Immutable from "immutable";
export default class DagGraph {
    graph: Immutable.Map<any, any>;
    constructor(graph: Immutable.Map<any, any>);
    currentStateId: StateId;
    setCurrentStateId(stateId: StateId): this;
    currentBranch: BranchId;
    setCurrentBranch(branchId: BranchId): this;
    latestOn(branch: BranchId): any;
    committedOn(branch: BranchId): any;
    setLatest(branch: BranchId, commit: StateId): this;
    setCommitted(branch: BranchId, commit: StateId): this;
    insertState(commit: StateId, parent: StateId, state: any): this;
    getState(commit: StateId): any;
    childrenOf(commit: StateId): any;
    parentOf(commit: StateId): any;
    addChild(parent: StateId, child: StateId): this;
    setParent(commit: StateId, parent: StateId): void;
    setChildren(parent: StateId, children: Immutable.List<StateId>): this;
    branches: any;
    branchesOf(commit: StateId): string[];
    prune(commits: any): this;
    private remove(commit);
    squashCurrentBranch(): this;
}
