import * as Immutable from 'immutable';
import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function squash<T>(history: IDagHistory<T>): IDagHistory<T> {
  log('squashing history');
  const { graph, current } = history;
  return {
    current,
    graph: graph.withMutations(g => new DagGraph(g).squashCurrentBranch()),
  };
}
