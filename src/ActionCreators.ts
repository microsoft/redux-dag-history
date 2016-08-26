import * as ActionTypes from "./ActionTypes";
import { createAction } from "redux-actions";
import {
    BranchId,
    StateId,
    RenameBookmarkPayload,
    MoveBookmarkPayload,
    ChangeBookmarkPayload,
    RenameBranchPayload,
} from "./interfaces";

export const load = createAction<any>(ActionTypes.LOAD);
export const clear = createAction<void>(ActionTypes.CLEAR);
export const undo = createAction<void>(ActionTypes.UNDO);
export const redo = createAction<void>(ActionTypes.REDO);
export const skipToStart = createAction<void>(ActionTypes.SKIP_TO_START);
export const skipToEnd = createAction<void>(ActionTypes.SKIP_TO_END);
export const jumpToState = createAction<StateId>(ActionTypes.JUMP_TO_STATE);
export const jumpToBranch = createAction<BranchId>(ActionTypes.JUMP_TO_BRANCH);
export const renameBranch = createAction<RenameBranchPayload>(ActionTypes.RENAME_BRANCH);
export const createBranch = createAction<string>(ActionTypes.CREATE_BRANCH);
export const squash = createAction<void>(ActionTypes.SQUASH);
export const addBookmark = createAction<StateId>(ActionTypes.ADD_BOOKMARK);
export const removeBookmark = createAction<StateId>(ActionTypes.REMOVE_BOOKMARK);
export const renameBookmark = createAction<RenameBookmarkPayload>(ActionTypes.RENAME_BOOKMARK);
export const changeBookmark = createAction<ChangeBookmarkPayload>(ActionTypes.CHANGE_BOOKMARK);
export const moveBookmark = createAction<MoveBookmarkPayload>(ActionTypes.MOVE_BOOKMARK);
export const pinState = createAction<StateId>(ActionTypes.PIN_STATE);
export const playBookmarkStory = createAction<void>(ActionTypes.PLAY_BOOKMARK_STORY);
export const skipToFirstBookmark = createAction<void>(ActionTypes.SKIP_TO_FIRST_BOOKMARK);
export const skipToLastBookmark = createAction<void>(ActionTypes.SKIP_TO_LAST_BOOKMARK);
export const nextBookmark = createAction<void>(ActionTypes.NEXT_BOOKMARK);
export const previousBookmark = createAction<void>(ActionTypes.PREVIOUS_BOOKMARK);
