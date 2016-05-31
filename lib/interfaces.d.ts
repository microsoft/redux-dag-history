export declare type StateId = string;
export declare type BranchId = string;
export interface IDagHistory {
    current: any;
    graph: any;
}
export interface StateIdGenerator {
    (): StateId;
}
