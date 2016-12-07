import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function renameBookmark<T>(
  bookmarkId: StateId,
  name: string,
  history: IDagHistory<T>,
): IDagHistory<T> {
  log('renaming bookmark %s => %s', bookmarkId, name);
  return {
    ...history,
    bookmarks: history.bookmarks.map((b) => {
      const isTargetBookmark = b.stateId === bookmarkId;
      return {
        ...b,
        name: isTargetBookmark ? name : b.name,
      };
    }),
  };
}
