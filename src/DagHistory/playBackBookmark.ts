import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import jump from "./jump";

export default function playBackBookmark<T>(rawIndex: number, history: IDagHistory<T>) {
    if (history.bookmarks.length === 0) {
        return history;
    }

    let index = Math.min(
        history.bookmarks.length - 1,
        Math.max(0, rawIndex)
    );
    const stateId = history.bookmarks[index].stateId;
    return jump(stateId, history, {
        pinnedStateId: null,
        bookmarkPlaybackIndex: index,
    });
}
