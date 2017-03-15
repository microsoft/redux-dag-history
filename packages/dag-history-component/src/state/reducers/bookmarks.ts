import {
  IConfiguration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';
import {
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  RENAME_BOOKMARK,
  CHANGE_BOOKMARK,
  MOVE_BOOKMARK,
} from '../actions/types';

export const INITIAL_STATE = [];

export default function reduce(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_BOOKMARK: {
      const { name, stateId, data } = action.payload;
      const newBookmark = { name, stateId, data: data || {} };
      return [...state, newBookmark];
    }

    case REMOVE_BOOKMARK: {
      const stateId = action.payload;
      return state.filter(element => element.stateId !== stateId);
    }

    case RENAME_BOOKMARK: {
      const { stateId, name: newName } = action.payload;
      return state.map((b) => {
        const isTarget = b.stateId === stateId;
        const name = isTarget ? newName : b.name;
        return { ...b, name };
      });
    }

    case CHANGE_BOOKMARK: {
      const { stateId, name, data } = action.payload;
      return state.map((b) => {
        const isTarget = b.stateId === stateId;
        return isTarget ? { name, stateId, data } : b;
      });
    }

    case MOVE_BOOKMARK: {
      const { from, to } = action.payload;
      const bookmarks = [...state];
      const moved = bookmarks[from];
      if (from !== to) {
        bookmarks.splice(from, 1);
        bookmarks.splice(to, 0, moved);
      }
      return bookmarks;
    }

    default: {
      return state;
    }
  }
}
