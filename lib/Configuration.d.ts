export declare const CLEAR: string;
export declare const UNDO: string;
export declare const REDO: string;
export declare const JUMP_TO_STATE: string;
export declare const JUMP_TO_BRANCH: string;
export declare const CREATE_BRANCH: string;
export declare const SQUASH: string;
export default class Configuation {
    private _rawConfig;
    constructor(_rawConfig: any);
    actionFilter: any;
    clearActionType: any;
    undoActionType: any;
    redoActionType: any;
    jumpToStateActionType: any;
    jumpToBranchActionType: any;
    createBranchActionType: any;
    squashActionType: any;
}
