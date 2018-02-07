export default function isHistoryAction(action: ReduxActions.Action<any>) {
	return action && action.type && action.type.startsWith('DAG_HISTORY_')
}
