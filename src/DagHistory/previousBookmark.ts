import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import getCurrentBookmarkIndex from './getCurrentBookmarkIndex';
import jumpToState from './jumpToState';
import playBackBookmark from './playBackBookmark';
import * as Immutable from 'immutable';

export default function previousBookmark(history: IDagHistory) {
    if (!Number.isInteger(history.bookmarkPlaybackIndex)) {
        let currentBookmarkIndex = getCurrentBookmarkIndex(history);
        if (currentBookmarkIndex > 0 && currentBookmarkIndex < history.bookmarks.length) {
            return jumpToState(history.bookmarks[currentBookmarkIndex - 1].stateId, history);
        }
        return history;
    }
    return playBackBookmark(history.bookmarkPlaybackIndex - 1, history);
}
