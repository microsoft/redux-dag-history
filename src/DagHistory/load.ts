import { fromJS } from "immutable";
import { IDagHistory } from "../interfaces";

export default function load<T>(history: any): IDagHistory<T> {
    return {
        ...history,
        graph: fromJS(history.graph),
    };
}
