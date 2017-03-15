import * as Types from '../actions/types';
import {
  IConfiguration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';
import isHistoryAction from './isHistoryAction';

export const INITIAL_STATE = {
  editIndex: undefined,
};

export default function makeReducer(config: IConfiguration<any>) {
  return function reduce(state = INITIAL_STATE, action) {
    if (action.type === Types.BOOKMARK_EDIT) {
      return { editIndex: action.payload };
    } else if (
      action.type === Types.BOOKMARK_EDIT_DONE ||
      !isHistoryAction(action) && config.actionFilter(action.type)
    ) {
      return INITIAL_STATE;
    }
    return state;
  };
}
