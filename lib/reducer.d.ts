import { IDagHistory } from "./interfaces";
export default function trackHistory(reducer: any, rawConfig?: {}): (state: any, action?: {
    type: any;
    payload: any;
}) => IDagHistory;
