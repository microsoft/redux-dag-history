import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';
import createHistory from './createHistory';

const log = require('debug')('redux-dag-history:DagHistory');

export default function clear<T>(history: IDagHistory<T>, config: IConfiguration<T>): IDagHistory<T> {
  log('clearing history');
  const { graph, current } = history;
  return createHistory(current, config);
}
