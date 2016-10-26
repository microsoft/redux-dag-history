/// <reference path="../../node_modules/typescript/lib/lib.es2017.d.ts" />
import { fromJS } from "immutable";

export default function load(history: any) {
    return Object.assign({}, history, { graph: fromJS(history.graph) });
}
