import { Action, createAction } from 'redux-actions'
import * as ActionTypes from './ActionTypes'
import { BranchId, RenameBranchPayload, StateId } from './interfaces'

export const load = createAction<any>(ActionTypes.LOAD)
export const clear = createAction<void>(ActionTypes.CLEAR)
export const undo = createAction<void>(ActionTypes.UNDO)
export const redo = createAction<void>(ActionTypes.REDO)
export const skipToStart = createAction<void>(ActionTypes.SKIP_TO_START)
export const skipToEnd = createAction<void>(ActionTypes.SKIP_TO_END)
export const jumpToState = createAction<StateId>(ActionTypes.JUMP_TO_STATE)
export const jumpToBranch = createAction<BranchId>(ActionTypes.JUMP_TO_BRANCH)
export const jumpToLatestOnBranch = createAction<BranchId>(
	ActionTypes.JUMP_TO_LATEST_ON_BRANCH,
)
export const renameBranch = createAction<RenameBranchPayload>(
	ActionTypes.RENAME_BRANCH,
)
export const createBranch = createAction<string>(ActionTypes.CREATE_BRANCH)
export const squash = createAction<void>(ActionTypes.SQUASH)
