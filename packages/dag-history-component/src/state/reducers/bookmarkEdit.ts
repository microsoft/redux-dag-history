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
      // Edit a bookmark
      return { editIndex: action.payload };
    } else if (action.type === Types.MOVE_BOOKMARK && action.payload.from === state.editIndex) {
      // If the user is moving the currently edited bookmark, update the editIndex
      return { editIndex: action.payload.to };
    } else if (
      action.type === Types.BOOKMARK_EDIT_DONE ||
      !isHistoryAction(action) && config.actionFilter(action.type)
    ) {
      // Clear the edit state
      return INITIAL_STATE;
    }
    return state;
  };
}
