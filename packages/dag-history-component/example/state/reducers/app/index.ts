import * as redux from 'redux';
import metadata from './metadata';
import visuals from './visuals';

export default redux.combineReducers({ metadata, visuals });
