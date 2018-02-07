import * as redux from 'redux'
import bookmarkEdit from './bookmarkEdit'
import bookmarks from './bookmarks'
import dragDrop from './dragDrop'
import pinnedState from './pinnedState'
import playback from './playback'
import views from './views'

import { ComponentConfiguration } from '../interfaces' // eslint-disable-line no-unused-vars

export default function createReducer<T>(config: ComponentConfiguration<T>) {
	return redux.combineReducers({
		bookmarkEdit: bookmarkEdit(config),
		dragDrop: dragDrop(config),
		views: views(config),
		playback: playback(config),
		pinnedState: pinnedState(config),
		bookmarks,
	})
}
