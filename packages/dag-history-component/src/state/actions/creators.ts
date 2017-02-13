import { StateId } from '@essex/redux-dag-history/lib/interfaces';
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators';
import * as ReduxActions from 'redux-actions';
import * as Types from './types';

const { createAction } = ReduxActions;

// Simple Action Creators
const doSelectBookmarkDepth = createAction<BookmarkDepthSelection>(Types.SELECT_BOOKMARK_DEPTH);
const doBookmarkDragDrop = createAction<void>(Types.BOOKMARK_DRAG_DROP);
export const selectMainView = createAction(Types.SELECT_MAIN_VIEW);
export const selectHistoryType = createAction<string>(Types.SELECT_HISTORY_TYPE);
export const toggleBranchContainer = createAction<void>(Types.TOGGLE_BRANCH_CONTAINER);
export const startPlayback = createAction<StartPlaybackPayload>(Types.START_PLAYBACK);
export const stopPlayback = createAction<void>(Types.STOP_PLAYBACK);
export const bookmarkDragStart = createAction<BookmarkDragStartPayload>(Types.BOOKMARK_DRAG_START);
export const bookmarkDragHover = createAction<BookmarkDragHoverPayload>(Types.BOOKMARK_DRAG_HOVER);
export const bookmarkDragCancel = createAction<void>(Types.BOOKMARK_DRAG_CANCEL);
export const addBookmark = createAction<AddBookmarkPayload>(Types.ADD_BOOKMARK);
export const removeBookmark = createAction<StateId>(Types.REMOVE_BOOKMARK);
export const renameBookmark = createAction<RenameBookmarkPayload>(Types.RENAME_BOOKMARK);
export const changeBookmark = createAction<ChangeBookmarkPayload>(Types.CHANGE_BOOKMARK);
export const moveBookmark = createAction<MoveBookmarkPayload>(Types.MOVE_BOOKMARK);

// Composite Action Creators
export function bookmarkDragDrop(payload: BookmarkDragDropPayload) {
  return (dispatch) => {
    dispatch(doBookmarkDragDrop());
    if (payload.droppedOn >= 0) {
      dispatch(moveBookmark({
        from: payload.index,
        to: payload.droppedOn,
      }));
    }
  };
}

export const selectBookmarkDepth = (payload: BookmarkDepthAndStateSelection) => {
  const {
    bookmarkIndex,
    depth,
    state,
  } = payload;
  return (dispatch) => {
    dispatch(doSelectBookmarkDepth({ bookmarkIndex, depth }));
    dispatch(DagHistoryActions.jumpToState(state));
  };
};

export const selectBookmark = (bookmarkIndex: number, state: StateId) => (
  selectBookmarkDepth({
    bookmarkIndex,
    depth: undefined,
    state,
  })
);

export interface StartPlaybackPayload {
  initialDepth: number;
}

export interface AddBookmarkPayload {
  stateId: StateId;
  name: string;
  data?: { [name: string]: any };
}

export interface BookmarkDragStartPayload {
  index: number;
  key: string;
}

export interface BookmarkDragHoverPayload {
  index: number;
}

export interface BookmarkDragDropPayload {
  index: number;
  droppedOn: number;
}

export interface BookmarkDepthSelection {
  bookmarkIndex?: number;
  depth?: number;
}

export interface BookmarkDepthAndStateSelection {
  bookmarkIndex: number;
  depth: number;
  state: StateId;
}

export interface RenameBookmarkPayload {
  stateId: StateId;
  name: string;
}

export interface MoveBookmarkPayload {
  from: number;
  to: number;
}

export interface ChangeBookmarkPayload {
  stateId: StateId;
  name: string;
  data: any;
}
