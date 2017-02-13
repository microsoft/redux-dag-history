const action = (name: string) => `DAG_HISTORY_${name.toUpperCase()}`;

/**
 * Loads a history graph, discarding the current history
 */
export const LOAD = action('load');

/**
 * Clears the state graph. The current state will become the root state of
 * the new graph.
 */
export const CLEAR = action('clear');

/**
 * Performs an Undo operation.
 *
 * An Undo operation will move the currentState pointer to being the parent of
 * the current state pointer.
 *
 * If the parent state pointer is null, no operation is performed.
 */
export const UNDO = action('undo');

/**
 * Performs a Redo operation.
 *
 * A Redo operation will move the currentState pointer to the next ancestor
 * the currentBranch.
 */
export const REDO = action('redo');

/**
 * Jumps to a specific state.
 *
 * If the state being jumped to is not an ancestor of the current branch, then
 * we will detach the current branch.
 */
export const JUMP_TO_STATE = action('jump_to_state');

/**
 * Jumps to the latest state in a branch.
 */
export const JUMP_TO_BRANCH = action('jump_to_branch');

/**
 * Jumps to the latest state in a branch.
 */
export const JUMP_TO_LATEST_ON_BRANCH = action('jump_to_latest_on_branch');

/**
 * Creates a new branch. Points the new branch to the current state.
 */
export const CREATE_BRANCH = action('create_branch');

/**
 * Renames a branch
 */
export const RENAME_BRANCH = action('rename_branch');

/**
 * Squashes the ancestors of the current state that do not support multiple branches.
 * e.g.    b                                b
 *     a <               will turn into  a <
 **        c -> d -> [e                     [e]
 */
export const SQUASH = action('squash');

/**
 * Renames the current state
 */
export const RENAME_STATE = action('rename_state');

/**
 * Pin a state for successor browsing
 */
export const PIN_STATE = action('pin_state');

/**
 * Skips to the beginning of the current history line
 */
export const SKIP_TO_START = action('skip_to_start');

/**
 * Skips to the end of the current history line
 */
export const SKIP_TO_END = action('skip_to_end');
