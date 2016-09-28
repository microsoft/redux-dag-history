const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import createHistory from './createHistory';

export default function clear(history: IDagHistory) {
    log("clearing history");
    const { graph, current } = history;
    return createHistory(current);
}