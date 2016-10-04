const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";

export default function addBookmark<T>(stateId: StateId, history: IDagHistory<T>, config: IConfiguration<T>) {
    log("adding bookmark on state %s", stateId);
    const { graph } = history;
    const reader = new DagGraph(graph);
    const stateName = reader.stateName(stateId);
    const result = Object.assign({}, history);
    result.bookmarks.push({
        stateId: stateId,
        name: config.bookmarkName(stateId, stateName),
        data: {},
    });
    return result;
}
