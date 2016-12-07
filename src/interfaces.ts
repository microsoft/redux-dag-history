import { Map as ImmutableMap } from 'immutable';
export type StateId = number;
export type BranchId = number;

export interface IConfiguration<T> {
  /**
   * A flag indicating whether or not to print per-action debug information
   */
  debug?: boolean;

  /**
   * A Predicate filter to determine whether an action is insertable into the history view.
   * If an action is not insertable, then the new state as the result of the action will replace
   * the current state
   */
  actionFilter?: (actionType: string) => boolean;

  /**
   * A predicate for determining whether two states are equal
   */
  stateEqualityPredicate?: (s1: T, s2: T) => boolean;

  /**
   * A function for generating map keys for states
   */
  stateKeyGenerator?: (state: T) => number;

  /**
   * Action Names
   */
  loadActionType?: string;
  clearActionType?: string;
  undoActionType?: string;
  redoActionType?: string;
  jumpToStateActionType?: string;
  jumpToBranchActionType?: string;
  jumpToLatestOnBranchActionType?: string;
  createBranchActionType?: string;
  renameBranchActionType?: string;
  renameStateActionType?: string;
  squashActionType?: string;
  addBookmarkActionType?: string;
  removeBookmarkActionType?: string;
  renameBookmarkActionType?: string;
  moveBookmarkActionType?: string;
  initialBranchName?: string;
  initialStateName?: string;
  pinStateActionType?: string;
  skipToStartActionType?: string;
  skipToEndActionType?: string;
  changeBookmarkActionType?: string;
  playBookmarkStoryActionType?: string;
  skipToFirstBookmarkActionType?: string;
  skipToLastBookmarkActionType?: string;
  nextBookmarkActionType?: string;
  previousBookmarkActionType?: string;

  /**
   * State, Branch, Bookmark Naming
   */
  actionName?: (state: any, stateId: StateId) => string;
  branchName?: (oldBranch: BranchId, newBranch: BranchId, actionName: string) => string;
  bookmarkName?: (stateId: StateId, actionName: string) => string;

  // CustomHandlers
  canHandleAction?: (action: any) => boolean;
  handleAction?: (action: any, history: IDagHistory<T>) => IDagHistory<T>;
}

/**
 * This interface represents the state shape of the DAG history in the Redux
 * state tree.
 */
export interface IDagHistory<T> {
  /**
   * The current application state
   */
  current: T;
  lastStateId: StateId;
  lastBranchId: BranchId;

  // Special States
  pinnedStateId?: StateId;
  bookmarkPlaybackIndex?: number;

  // Bookmark Data
  bookmarks: Array<{
    stateId: StateId;
    name: string;
    data: any;
  }>;

  /**
   * A weak mapping of hash-codes to state, for efficient duplicate state lookup
   */
  stateHash: WeakMap<number, StateId>;

  /**
   * A chronological log of states visited in the application
   */
  chronologicalStates: StateId[];

  /**
   * The explored state space, represented as a graph (future and past)
   */
  graph: ImmutableMap<any, any>; // {
      /*
      current: {

          state: StateId,

          /**
           * The current branch being used
          branch: BranchId,
      },

      /**
       * Branches are Pointers to State Tracks
      branches: {
          [id: string]: { // BranchId
              latest: StateId;
              committed: StateId;
          };
      };

      /**
       * A hash of states by ID
      states: {
          [id: string]: { // StateId
              /**
               * The application state for this state node
              state: any;

              /**
               * The child states of this state
              children: StateId[];

              /**
               * The parent state ID. If this is null, then this state has no parent.
              parent?: StateId;
          };
      };
  };*/
};

export interface StateIdGenerator {
  (lastStateId: StateId): StateId;
}

export interface StateNameGenerator {
  (state: any, id: StateId): string;
}

export interface RenameBookmarkPayload {
  bookmark: StateId;
  name: string;
}

export interface RenameBranchPayload {
  branch: BranchId;
  name: string;
}

export interface MoveBookmarkPayload {
  from: number;
  to: number;
}

export interface ChangeBookmarkPayload {
  bookmark: StateId;
  name: string;
  data: any;
}
