const action = (name: string) => `DAG_HISTORY_COMPONENT_${name.toUpperCase()}`;

// Action Types
export const SELECT_MAIN_VIEW = action('SELECT_MAIN_VIEW');
export const SELECT_HISTORY_TYPE = action('SELECT_HISTORY_TYPE');
export const SELECT_BOOKMARK_DEPTH = action('SELECT_BOOKMARK_DEPTH');
export const TOGGLE_BRANCH_CONTAINER = action('TOGGLE_BRANCH_CONTAINER');
export const START_PLAYBACK = action('START_PLAYBACK');
export const STOP_PLAYBACK = action('STOP_PLAYBACK');
export const BOOKMARK_DRAG_START = action('BOOKMARK_DRAG_START');
export const BOOKMARK_DRAG_HOVER = action('BOOKMARK_DRAG_HOVER');
export const BOOKMARK_DRAG_DROP = action('BOOKMARK_DRAG_DROP');
export const BOOKMARK_DRAG_CANCEL = action('BOOKMARK_DRAG_CANCEL');

/**
 * Add a new state bookmark
 */
export const ADD_BOOKMARK = action('add_bookmark');

/**
 * Remove a state bookmark
 */
export const REMOVE_BOOKMARK = action('remove_bookmark');

/**
 * Rename a state bookmark
 */
export const RENAME_BOOKMARK = action('rename_bookmark');

/**
 * Change a state bookmark
 */
export const CHANGE_BOOKMARK = action('change_bookmark');

/**
 * Move a bookmark to a different position
 */
export const MOVE_BOOKMARK = action('move_bookmark');
