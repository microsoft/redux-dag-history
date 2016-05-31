export declare const clear: (...args: void[]) => ReduxActions.Action<void>;
export declare const undo: (...args: void[]) => ReduxActions.Action<void>;
export declare const redo: (...args: void[]) => ReduxActions.Action<void>;
export declare const jumpToState: (...args: string[]) => ReduxActions.Action<string>;
export declare const jumpToBranch: (...args: string[]) => ReduxActions.Action<string>;
export declare const createBranch: (...args: string[]) => ReduxActions.Action<string>;
export declare const squash: (...args: void[]) => ReduxActions.Action<void>;
