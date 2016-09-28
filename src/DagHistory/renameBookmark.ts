const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";

export default function renameBookmark(bookmarkId: StateId, name: string, history: IDagHistory) {
    log("renaming bookmark %s => %s", bookmarkId, name);
    const result = Object.assign({}, history);
    result.bookmarks.forEach(b => {
        if (b.stateId === bookmarkId) {
            b.name = name;
        }
    });
    return result;
}
