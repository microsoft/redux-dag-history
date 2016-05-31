import * as ActionCreators from "./ActionCreators";
import * as ActionTypes from "./ActionTypes";
import Configuration from "./Configuration";
import DagGraph from "./DagGraph";
import * as DagHistory from "./DagHistory";
import * as interfaces from "./interfaces";
declare var _default: {
    ActionCreators: typeof ActionCreators;
    ActionTypes: typeof ActionTypes;
    Configuration: typeof Configuration;
    DagGraph: typeof DagGraph;
    DagHistory: typeof DagHistory;
    reducer: (reducer: any, rawConfig?: {}) => (state: any, action?: {
        type: any;
        payload: any;
    }) => interfaces.IDagHistory;
};
export = _default;
