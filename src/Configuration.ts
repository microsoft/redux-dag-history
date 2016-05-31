import * as ActionTypes from "./ActionTypes";

export const CLEAR = "DAG_HISTORY_CLEAR";
export const UNDO = "DAG_HISTORY_UNDO";
export const REDO = "DAG_HISTORY_REDO";
export const JUMP_TO_STATE = "DAG_HISTORY_JUMP_TO_STATE";
export const JUMP_TO_BRANCH = "DAG_HISTORY_JUMP_TO_BRANCH";
export const CREATE_BRANCH = "DAG_HISTORY_CREATE_BRANCH";
export const SQUASH = "DAG_HISTORY_SQUASH";

const DEFAULT_ACTION_FILTER = () => true;

export default class Configuation {
    constructor(private _rawConfig) {
    }

    public get actionFilter() {
        return this._rawConfig.actionFilter || DEFAULT_ACTION_FILTER;
    }

    public get clearActionType() {
        return this._rawConfig.clearActionType || ActionTypes.CLEAR;
    }

    public get undoActionType() {
        return this._rawConfig.undoActionType || ActionTypes.UNDO;
    }

    public get redoActionType() {
        return this._rawConfig.redoActionType || ActionTypes.REDO;
    }

    public get jumpToStateActionType() {
        return this._rawConfig.jumpToStateActionType || ActionTypes.JUMP_TO_STATE;
    }

    public get jumpToBranchActionType() {
        return this._rawConfig.jumpToBranchActionType || ActionTypes.JUMP_TO_BRANCH;
    }

    public get createBranchActionType() {
        return this._rawConfig.createBranchActionType || ActionTypes.CREATE_BRANCH;
    }

    public get squashActionType() {
        return this._rawConfig.squashActionType || ActionTypes.SQUASH;
    }
}
