import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";

export default function isCurrentStateBookmarked(history: IDagHistory) {
    const currentStateId = new DagGraph(history.graph).currentStateId;
    return history.bookmarks.some(e => e.stateId === currentStateId);
}