import { fromJS } from "immutable";

export default function load(history: any) {
    return Object.assign({}, history, { graph: fromJS(history.graph) });
}
