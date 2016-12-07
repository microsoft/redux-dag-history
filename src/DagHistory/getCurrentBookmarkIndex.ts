import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function getCurrentBookmarkIndex<T>(history: IDagHistory<T>): number {
  const reader = new DagGraph(history.graph);
  const currentStateId = reader.currentStateId;
  let currentBookmarkIndex = -1;
  for (let i = 0; i < history.bookmarks.length; i++) { // eslint-disable-line no-plusplus
    const bookmark = history.bookmarks[i];
    if (bookmark.stateId === currentStateId) {
      currentBookmarkIndex = i;
      break;
    }
  }
  return currentBookmarkIndex;
}
