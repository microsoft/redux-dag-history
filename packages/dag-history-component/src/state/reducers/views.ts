import {
  IComponentConfiguration, // eslint-disable-line no-unused-vars
} from '../interfaces';
import {
  SELECT_MAIN_VIEW,
  SELECT_HISTORY_TYPE,
  TOGGLE_BRANCH_CONTAINER,
} from '../actions/types';

export const INITIAL_STATE = {
  mainView: 'history',
  historyType: 'branched',
  branchContainerExpanded: true,
};

export default function makeReducer<T>(config: IComponentConfiguration<T>) {
  const initialState = {
    ...INITIAL_STATE,
    ...config.initialViewState,
  };
  return function reduce(state = initialState, action) {
    let result = state;
    if (action.type === SELECT_MAIN_VIEW) {
      result = {
        ...state,
        mainView: action.payload,
      };
    } else if (action.type === SELECT_HISTORY_TYPE) {
      result = {
        ...state,
        historyType: action.payload,
      };
    } else if (action.type === TOGGLE_BRANCH_CONTAINER) {
      result = {
        ...state,
        branchContainerExpanded: !state.branchContainerExpanded,
      };
    } else if (action.type.indexOf('DAG_HISTORY_') !== 0 && config.actionFilter(action.type)) {
      // Insertable actions clear the pinned state
      result = {
        ...state,
        mainView: 'history',
      };
    }
    return result;
  };
}
