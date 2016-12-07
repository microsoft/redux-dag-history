import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function moveBookmark<T>(
  from: number,
  to: number,
  history: IDagHistory<T>,
): IDagHistory<T> {
  log('moving bookmark at %s to %s', from, to);
  const result = { ...history };
  const actualTo = from < to ? to - 1 : to;
  result.bookmarks.splice(actualTo, 0, result.bookmarks.splice(from, 1)[0]);
  return result;
}
