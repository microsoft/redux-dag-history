import * as ActionTypes from "./ActionTypes";
import { createAction } from "redux-actions";
import { BranchId, StateId } from "./interfaces";

export const load = createAction<any>(ActionTypes.LOAD);
export const clear = createAction<void>(ActionTypes.CLEAR);
export const undo = createAction<void>(ActionTypes.UNDO);
export const redo = createAction<void>(ActionTypes.REDO);
export const jumpToState = createAction<StateId>(ActionTypes.JUMP_TO_STATE);
export const jumpToBranch = createAction<BranchId>(ActionTypes.JUMP_TO_BRANCH);
export const createBranch = createAction<string>(ActionTypes.CREATE_BRANCH);
export const squash = createAction<void>(ActionTypes.SQUASH);
