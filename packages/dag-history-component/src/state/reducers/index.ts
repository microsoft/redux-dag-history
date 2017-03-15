import * as redux from 'redux';
import dragDrop from './dragDrop';
import views from './views';
import playback from './playback';
import bookmarks from './bookmarks';
import pinnedState from './pinnedState';
import bookmarkEdit from './bookmarkEdit';

import { IComponentConfiguration } from '../interfaces'; // eslint-disable-line no-unused-vars

export default function createReducer<T>(config: IComponentConfiguration<T>) {
  return redux.combineReducers({
    bookmarkEdit: bookmarkEdit(config),
    dragDrop: dragDrop(config),
    views: views(config),
    playback: playback(config),
    pinnedState: pinnedState(config),
    bookmarks,
  });
}
