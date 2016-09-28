const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";

export default function changeBookmark(bookmarkId: StateId, name: string, data: any, history: IDagHistory) {
    log("changing bookmark data %s", bookmarkId, name, data);
    const result = Object.assign({}, history);
    result.bookmarks.forEach(b => {
        if (b.stateId === bookmarkId) {
            b.name = name;
            b.data = data;
        }
    });
    return result;
}