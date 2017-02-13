import {
  IConfiguration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';
import {
  BOOKMARK_DRAG_START,
  BOOKMARK_DRAG_HOVER,
  BOOKMARK_DRAG_DROP,
  BOOKMARK_DRAG_CANCEL,
} from '../actions/types';

export const INITIAL_STATE = {
  sourceIndex: undefined,
  sourceKey: undefined,
  hoverIndex: undefined,
};

export default function makeReducer(config: IConfiguration<any>) {
  return function reduce(state = INITIAL_STATE, action) {
    let result = state;
    if (action.type === BOOKMARK_DRAG_START) {
      result = {
        ...state,
        sourceIndex: action.payload.index,
        sourceKey: action.payload.key,
      };
    } else if (action.type === BOOKMARK_DRAG_HOVER) {
      const hoverIndex = action.payload.index;
      result = {
        ...state,
        hoverIndex,
      };
    } else if (action.type === BOOKMARK_DRAG_DROP) {
      result = INITIAL_STATE;
    } else if (action.type === BOOKMARK_DRAG_CANCEL) {
      result = INITIAL_STATE;
    } else if (action.type.indexOf('DAG_HISTORY_') !== 0 && config.actionFilter(action.type)) {
      result = INITIAL_STATE;
    }
    return result;
  };
}
