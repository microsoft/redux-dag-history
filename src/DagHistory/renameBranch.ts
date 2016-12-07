import * as Immutable from 'immutable';
import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function renameBranch<T>(
  branchId: BranchId,
  branchName: string,
  history: IDagHistory<T>,
): IDagHistory<T> {
  const { graph } = history;
  log('renaming branch %s => %s', branchId, branchName);
  return {
    ...history,
    graph: graph.withMutations((g) => {
      new DagGraph(g).setBranchName(branchId, branchName);
    }),
  };
}
