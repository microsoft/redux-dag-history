import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function changeBookmark<T>(
  bookmarkId: StateId,
  name: string,
  data: any,
  history: IDagHistory<T>
): IDagHistory<T> {
  log('changing bookmark data %s', bookmarkId, name, data);
  return {
    ...history,
    bookmarks: history.bookmarks.map((b) => {
      const isTargetBookmark = b.stateId === bookmarkId;
      return {
        ...b,
        name: isTargetBookmark ? name : b.name,
        data: isTargetBookmark ? data : b.data,
      };
    }),
  };
}
