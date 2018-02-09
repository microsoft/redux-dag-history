import { Action } from 'redux-actions'

export default function isHistoryAction(
	action: ReduxActions.Action<any>,
): boolean {
	return !!(action && action.type && action.type.startsWith('DAG_HISTORY_'))
}
