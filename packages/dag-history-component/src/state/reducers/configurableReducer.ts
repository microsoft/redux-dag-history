import { Action } from 'redux-actions'

export type ConfigurableReducer<STATE, CONFIG> = (
	state: STATE,
	action: Action<any>,
	config: CONFIG,
) => STATE

export default function makeReducer<STATE, CONFIG>(
	reducer: ConfigurableReducer<STATE, CONFIG>,
) {
	return (config: CONFIG) => (state: STATE, action: Action<any>) =>
		reducer(state, action, config)
}
