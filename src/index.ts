import { Action } from "redux-actions";
import * as ActionCreators from "./ActionCreators";
import * as ActionTypes from "./ActionTypes";
import Configuration from "./Configuration";
import DagGraph from "./DagGraph";
import * as DagHistory from "./DagHistory";
import * as interfaces from "./interfaces";
import reducer from "./reducer";

export = {
    ActionCreators,
    ActionTypes,
    Configuration,
    DagGraph,
    DagHistory,
    reducer,
};
