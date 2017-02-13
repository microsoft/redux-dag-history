import {
  IConfiguration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';
import {
  SELECT_BOOKMARK_DEPTH,
  START_PLAYBACK,
  STOP_PLAYBACK,
} from '../actions/types';

export const INITIAL_STATE = {
  isPlayingBack: false,
  bookmark: undefined,
  depth: undefined,
};

export default function (config: IConfiguration<any>) {
  return function reduce(state = INITIAL_STATE, action) {
    let result = state;
    if (action.type === START_PLAYBACK) {
      const { initialDepth } = action.payload;
      result = {
        ...state,
        isPlayingBack: true,
        bookmark: 0,
        depth: initialDepth,
      };
    } else if (action.type === STOP_PLAYBACK) {
      result = INITIAL_STATE;
    } else if (action.type === SELECT_BOOKMARK_DEPTH) {
      const { depth, bookmarkIndex } = action.payload;
      result = {
        ...state,
        bookmark: bookmarkIndex === undefined ? state.bookmark : bookmarkIndex,
        depth,
      };
    } else if (action.type.indexOf('DAG_HISTORY_') !== 0 && config.actionFilter(action.type)) {
      // Insertable actions clear the pinned state
      result = {
        ...state,
        bookmark: undefined,
        depth: undefined,
      };
    }
    return result;
  };
}
