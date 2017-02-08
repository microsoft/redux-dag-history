import * as ActionTypes from './ActionTypes';
import { IConfiguration, BranchId, StateId, IDagHistory } from './interfaces';
export const CLEAR = 'DAG_HISTORY_CLEAR';
export const UNDO = 'DAG_HISTORY_UNDO';
export const REDO = 'DAG_HISTORY_REDO';
export const JUMP_TO_STATE = 'DAG_HISTORY_JUMP_TO_STATE';
export const JUMP_TO_BRANCH = 'DAG_HISTORY_JUMP_TO_BRANCH';
export const CREATE_BRANCH = 'DAG_HISTORY_CREATE_BRANCH';
export const SQUASH = 'DAG_HISTORY_SQUASH';

const DEFAULT_ACTION_FILTER = () => true;

export default class Configuration<T> implements IConfiguration<T> {
    constructor(protected rawConfig: IConfiguration<T>) {
    }

    public get stateEqualityPredicate() {
        return this.rawConfig.stateEqualityPredicate;
    }

    public get stateKeyGenerator() {
        return this.rawConfig.stateKeyGenerator;
    }

    public actionName(state: T, id: StateId) {
        if (this.rawConfig.actionName) {
            return this.rawConfig.actionName(state, id);
        } else {
            return `State ${id}`;
        };
    }

    public branchName(oldBranch: BranchId, newBranch: BranchId, actionName: string) {
        if (this.rawConfig.branchName) {
            return this.rawConfig.branchName(oldBranch, newBranch, actionName);
        }
        return `${newBranch}: ${actionName}`;
    }

    public canHandleAction(action: any): boolean {
        return this.rawConfig.canHandleAction && this.rawConfig.canHandleAction(action);
    }

    public handleAction(action: any, history: IDagHistory<T>): IDagHistory<T> {
        return this.rawConfig.handleAction(action, history);
    }

    public get debug() {
        return this.rawConfig.debug || false;
    }

    public get actionFilter() {
        return this.rawConfig.actionFilter || DEFAULT_ACTION_FILTER;
    }

    public get loadActionType() {
        return this.rawConfig.loadActionType || ActionTypes.LOAD;
    }

    public get clearActionType() {
        return this.rawConfig.clearActionType || ActionTypes.CLEAR;
    }

    public get undoActionType() {
        return this.rawConfig.undoActionType || ActionTypes.UNDO;
    }

    public get redoActionType() {
        return this.rawConfig.redoActionType || ActionTypes.REDO;
    }

    public get jumpToStateActionType() {
        return this.rawConfig.jumpToStateActionType || ActionTypes.JUMP_TO_STATE;
    }

    public get jumpToBranchActionType() {
        return this.rawConfig.jumpToBranchActionType || ActionTypes.JUMP_TO_BRANCH;
    }

    public get jumpToLatestOnBranchActionType() {
        return this.rawConfig.jumpToLatestOnBranchActionType || ActionTypes.JUMP_TO_LATEST_ON_BRANCH;
    }

    public get createBranchActionType() {
        return this.rawConfig.createBranchActionType || ActionTypes.CREATE_BRANCH;
    }

    public get renameBranchActionType() {
        return this.rawConfig.renameBranchActionType || ActionTypes.RENAME_BRANCH;
    }

    public get squashActionType() {
        return this.rawConfig.squashActionType || ActionTypes.SQUASH;
    }

    public get renameStateActionType() {
        return this.rawConfig.renameStateActionType || ActionTypes.RENAME_STATE;
    }

    public get pinStateActionType() {
        return this.rawConfig.pinStateActionType || ActionTypes.PIN_STATE;
    }

    public get skipToStartActionType() {
        return this.rawConfig.skipToStartActionType || ActionTypes.SKIP_TO_START;
    }

    public get skipToEndActionType() {
        return this.rawConfig.skipToEndActionType || ActionTypes.SKIP_TO_END;
    }

    public get initialBranchName() {
        return this.rawConfig.initialBranchName || 'Branch 1';
    }

    public get initialStateName() {
        return this.rawConfig.initialStateName || 'Initial';
    }
}
