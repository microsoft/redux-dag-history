import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function removeBookmark<T>(
  stateId: StateId,
  history: IDagHistory<T>,
): IDagHistory<T> {
  log('removing bookmark for state %s', stateId);
  return {
    ...history,
    bookmarks: history.bookmarks.filter(element => element.stateId !== stateId),
  };
}
