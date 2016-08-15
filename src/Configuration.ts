import * as ActionTypes from "./ActionTypes";
import { IConfiguration, BranchId, StateId, IDagHistory } from "./interfaces";
export const CLEAR = "DAG_HISTORY_CLEAR";
export const UNDO = "DAG_HISTORY_UNDO";
export const REDO = "DAG_HISTORY_REDO";
export const JUMP_TO_STATE = "DAG_HISTORY_JUMP_TO_STATE";
export const JUMP_TO_BRANCH = "DAG_HISTORY_JUMP_TO_BRANCH";
export const CREATE_BRANCH = "DAG_HISTORY_CREATE_BRANCH";
export const SQUASH = "DAG_HISTORY_SQUASH";

const DEFAULT_ACTION_FILTER = () => true;

export default class Configuation implements IConfiguration {
    constructor(private _rawConfig: IConfiguration) {
    }

    public actionName(state: any, id: StateId) {
        if (this._rawConfig.actionName) {
            return this._rawConfig.actionName(state, id);
        } else {
            return `State ${id}`;
        };
    }

    public branchName(oldBranch: BranchId, newBranch: BranchId, actionName: string) {
        return actionName;
    }

    public bookmarkName(stateId: StateId, actionName: string) {
        return actionName;
    }

    public canHandleAction(action: any): boolean {
        return this._rawConfig.canHandleAction && this._rawConfig.canHandleAction(action);
    }

    public handleAction(action: any, history: IDagHistory): IDagHistory {
        return this._rawConfig.handleAction(action, history);
    }

    public get debug() {
        return this._rawConfig.debug || false;
    }

    public get actionFilter() {
        return this._rawConfig.actionFilter || DEFAULT_ACTION_FILTER;
    }

    public get loadActionType() {
        return this._rawConfig.loadActionType || ActionTypes.LOAD;
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

    public get renameStateActionType() {
        return this._rawConfig.renameStateActionType || ActionTypes.RENAME_STATE;
    }

    public get addBookmarkActionType() {
        return this._rawConfig.addBookmarkActionType || ActionTypes.ADD_BOOKMARK;
    }

    public get removeBookmarkActionType() {
        return this._rawConfig.removeBookmarkActionType || ActionTypes.REMOVE_BOOKMARK;
    }

    public get renameBookmarkActionType() {
        return this._rawConfig.renameBookmarkActionType || ActionTypes.RENAME_BOOKMARK;
    }

    public get changeBookmarkActionType() {
        return this._rawConfig.changeBookmarkActionType || ActionTypes.CHANGE_BOOKMARK;
    }

    public get moveBookmarkActionType() {
        return this._rawConfig.moveBookmarkActionType || ActionTypes.MOVE_BOOKMARK;
    }

    public get pinStateActionType() {
        return this._rawConfig.pinStateActionType || ActionTypes.PIN_STATE;
    }

    public get skipToStartActionType() {
        return this._rawConfig.skipToStartActionType || ActionTypes.SKIP_TO_START;
    }

    public get skipToEndActionType() {
        return this._rawConfig.skipToEndActionType || ActionTypes.SKIP_TO_END;
    }

    public get playBookmarkStoryActionType() {
        return this._rawConfig.playBookmarkStoryActionType || ActionTypes.PLAY_BOOKMARK_STORY;
    }

    public get skipToFirstBookmarkActionType() {
        return this._rawConfig.skipToFirstBookmarkActionType || ActionTypes.SKIP_TO_FIRST_BOOKMARK;
    }

    public get skipToLastBookmarkActionType() {
        return this._rawConfig.skipToLastBookmarkActionType || ActionTypes.SKIP_TO_LAST_BOOKMARK;
    }

    public get nextBookmarkActionType() {
        return this._rawConfig.nextBookmarkActionType || ActionTypes.NEXT_BOOKMARK;
    }

    public get previousBookmarkActionType() {
        return this._rawConfig.previousBookmarkActionType || ActionTypes.PREVIOUS_BOOKMARK;
    }

    public get initialBranchName() {
        return this._rawConfig.initialBranchName || "Initial";
    }

    public get initialStateName() {
        return this._rawConfig.initialStateName || "Initial";
    }
}
