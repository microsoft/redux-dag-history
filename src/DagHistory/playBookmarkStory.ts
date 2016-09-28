import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import playBackBookmark from './playBackBookmark';

export default function playBookmarkStory(history: IDagHistory) {
    if (!Number.isInteger(history.bookmarkPlaybackIndex)) {
        return playBackBookmark(0, history);
    } else {
        return Object.assign({}, history, { bookmarkPlaybackIndex: null });
    }
}