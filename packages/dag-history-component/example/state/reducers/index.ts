import * as redux from 'redux';
import dagHistory from '@essex/redux-dag-history/lib/reducer';
import Configuration from '../../../src/state/Configuration';
import app from './app';
import history from '../../../src/state/reducers';

const log = require('debug')('app:state');

export const EXCLUDED_ACTION_NAMES = [
  '@@INIT',
  'INIT',
  'TOGGLE_BRANCH_CONTAINER',
  'SELECT_MAIN_VIEW',
  'SELECT_HISTORY_TYPE',
  'RETRIEVE_INITIAL_STATE_IGNORE_THIS_EVENT',
  'HIGHLIGHT_SUCCESSORS',
];

function stateEqualityPredicate(state1, state2) {
  log('checking equality between states', state1, state2);
  const colorsEqual = state1.visuals.color === state2.visuals.color;
  const valuesEqual = state1.visuals.value === state2.visuals.value;
  return colorsEqual && valuesEqual;
}

function hashString(str) {
  let hash = 0;
  let i;
  let chr;
  let len;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0, len = str.length; i < len; i += 1) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr; // eslint-disable-line no-bitwise
    hash |= 0; // eslint-disable-line no-bitwise
  }
  return hash;
}

function stateKeyGenerator(state) {
  const { color, value } = state.visuals;
  const stateString = `${color}:${value}`;
  return hashString(stateString);
}

const DAG_HISTORY_CONFIG = new Configuration({
  // Middleware Config
  debug: false,
  actionName: state => state.metadata.name,
  actionFilter: actionType => EXCLUDED_ACTION_NAMES.indexOf(actionType) === -1,
  stateEqualityPredicate,
  stateKeyGenerator,

  // UI Config
  initialViewState: {
    branchContainerExpanded: false,
  },
});

export default redux.combineReducers({
  app: dagHistory(app, DAG_HISTORY_CONFIG),
  component: history(DAG_HISTORY_CONFIG),
});
