const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";

export default function removeBookmark(stateId: StateId, history: IDagHistory) {
    log("removing bookmark for state %s", stateId);
    const result = Object.assign({}, history) as IDagHistory;
    result.bookmarks = history.bookmarks.filter((element) => element.stateId !== stateId);
    return result;
}