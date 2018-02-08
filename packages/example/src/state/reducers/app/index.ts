import * as redux from 'redux'
import metadata, { State as MetadataState } from './metadata'
import visuals, { State as VisualsState } from './visuals'

export interface State {
	metadata: MetadataState
	visuals: VisualsState
}

export default redux.combineReducers({ metadata, visuals })
