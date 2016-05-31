import { IDagHistory, StateIdGenerator, StateId, BranchId } from "./interfaces";
export declare function createHistory(initialState?: {}, generateNextId?: StateIdGenerator): IDagHistory;
export declare function insert(state: any, history: IDagHistory, generateNextId?: StateIdGenerator): IDagHistory;
export declare function jumpToState(stateId: StateId, history: IDagHistory): {
    current: any;
    graph: any;
};
export declare function jumpToBranch(branch: BranchId, history: IDagHistory): {
    current: any;
    graph: any;
};
export declare function undo(history: IDagHistory): {
    current: any;
    graph: any;
};
export declare function redo(history: IDagHistory): {
    current: any;
    graph: any;
};
export declare function createBranch(branchId: BranchId, history: IDagHistory): {
    current: any;
    graph: any;
};
export declare function clear(history: IDagHistory): IDagHistory;
export declare function squash(history: IDagHistory): {
    current: any;
    graph: any;
};
