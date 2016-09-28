import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import playBackBookmark from './playBackBookmark';
import jumpToState from './jumpToState';

export default function skipToLastBookmark(history: IDagHistory) {
    if (history.bookmarkPlaybackIndex !== null) {
        return playBackBookmark(history.bookmarks.length - 1, history);
    } else if (history.bookmarks.length > 0) {
        return jumpToState(history.bookmarks[history.bookmarks.length - 1].stateId, history);
    }
}