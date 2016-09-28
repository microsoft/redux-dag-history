const log = require("debug")("redux-dag-history:DagHistory");
import {
    IDagHistory,
    StateId,
    BranchId,
} from "../interfaces";
import load from "./load";

export default function createHistory(
    initialState = {},
    initialBranchName: string = "Initial",
    initialStateName: string = "Initial"
): IDagHistory {
    log("creating history");
    const currentStateId = 1;
    const currentBranchId = 1;
    const currentBookmarkId = 0;
    return load({
        current: initialState,
        lastStateId: currentStateId,
        lastBranchId: currentBranchId,
        pinnedStateId: null,
        bookmarks: [],
        bookmarkPlaybackIndex: null,
        graph: {
            current: {
                state: currentStateId,
                branch: currentBranchId,
            },
            branches: {
                [currentBranchId]: {
                    latest: currentStateId,
                    name: initialBranchName,
                    first: currentStateId,
                    committed: currentStateId,
                },
            },
            states: {
                [currentStateId]: {
                    state: initialState,
                    name: initialStateName,
                    branch: 1,
                    parent: null
                },
            },
        },
    });
}