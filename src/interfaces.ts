import * as Immutable from "immutable";
export type StateId = number;
export type BranchId = number;

export interface IConfiguration {
    debug?: boolean;
    actionFilter?: (actionType: string) => boolean;
    loadActionType?: string;
    clearActionType?: string;
    undoActionType?: string;
    redoActionType?: string;
    jumpToStateActionType?: string;
    jumpToBranchActionType?: string;
    createBranchActionType?: string;
    renameStateActionType?: string;
    squashActionType?: string;
    addBookmarkActionType?: string;
    removeBookmarkActionType?: string;
    renameBookmarkActionType?: string;
    initialBranchName?: string;
    initialStateName?: string;
    actionName?: (state: any, stateId: StateId) => string;
}

/**
 * This interface represents the state shape of the DAG history in the Redux
 * state tree.
 */
export interface IDagHistory {
    /**
     * The current application state
     */
    current: any;
    lastStateId: StateId;
    lastBranchId: BranchId;
    bookmarks: Array<{
        stateId: StateId;
        name: string;
    }>;
    /**
     * The explored state space, represented as a graph (future and past)
     */
    graph: Immutable.Map<any, any>; // {
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
    bookmark: BookmarkId;
    name: string;
}
