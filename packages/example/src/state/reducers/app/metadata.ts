import * as Actions from '../../Actions'

const DEFAULT_STATE: State = {
	name: 'Initial',
	historyIndex: 0,
	source: null,
}

export interface State {
	name: string
	historyIndex: number
	source: string | null
}

export default function reduce(
	state: State = DEFAULT_STATE,
	action: ReduxActions.Action<any>,
) {
	if (action.type === Actions.INCREMENT) {
		return {
			name: 'Increment Value',
			source: 'Incrementer',
			historyIndex: state.historyIndex + 1,
		}
	} else if (action.type === Actions.DECREMENT) {
		return {
			name: 'Decrement Value',
			source: 'Incrementer',
			historyIndex: state.historyIndex + 1,
		}
	} else if (action.type === Actions.PICK_RANDOM_COLOR) {
		return {
			name: 'Pick Random Color',
			source: 'Color Picker',
			historyIndex: state.historyIndex + 1,
		}
	}
	return state
}
