/**
 * Loads a history graph, discarding the current history
 */
export const LOAD = "DAG_HISTORY_LOAD";

/**
 * Clears the state graph. The current state will become the root state of
 * the new graph.
 */
export const CLEAR = "DAG_HISTORY_CLEAR";

/**
 * Performs an Undo operation.
 *
 * An Undo operation will move the currentState pointer to being the parent of
 * the current state pointer.
 *
 * If the parent state pointer is null, no operation is performed.
 */
export const UNDO = "DAG_HISTORY_UNDO";

/**
 * Performs a Redo operation.
 *
 * A Redo operation will move the currentState pointer to the next ancestor
 * the currentBranch.
 */
export const REDO = "DAG_HISTORY_REDO";

/**
 * Jumps to a specific state.
 *
 * If the state being jumped to is not an ancestor of the current branch, then
 * we will detach the current branch.
 */
export const JUMP_TO_STATE = "DAG_HISTORY_JUMP_TO_STATE";

/**
 * Jumps to the latest state in a branch.
 */
export const JUMP_TO_BRANCH = "DAG_HISTORY_JUMP_TO_BRANCH";

/**
 * Creates a new branch. Points the new branch to the current state.
 */
export const CREATE_BRANCH = "DAG_HISTORY_CREATE_BRANCH";

/**
 * Squashes the ancestors of the current state that do not support multiple branches.
 * e.g.    b                                b
 *     a <               will turn into  a <
 **        c -> d -> [e                     [e]
 */
export const SQUASH = "DAG_HISTORY_SQUASH";

/**
 * Renames the current state
 */
export const RENAME_STATE = "DAG_HISTORY_RENAME_STATE";
