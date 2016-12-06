import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import playBackBookmark from "./playBackBookmark";
import jumpToState from "./jumpToState";

export default function skipToFirstBookmark<T>(history: IDagHistory<T>): IDagHistory<T> {
    if (history.bookmarkPlaybackIndex !== null) {
        return playBackBookmark(0, history);
    } else if (history.bookmarks.length > 0) {
        return jumpToState(history.bookmarks[0].stateId, history);
    }
}
