import * as Immutable from 'immutable';
import DagGraph from '../DagGraph';
import nextId from '../nextId';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function createBranch<T>(
  branchName: string,
  history: IDagHistory<T>
): IDagHistory<T> {
  log('creating branch %s', branchName);
  const { graph, current } = history;
  const reader = new DagGraph(graph);

  return {
    ...history,
    current,
    graph: graph.withMutations((g) => {
      const reader = new DagGraph(graph);
      const { lastBranchId } = reader;
      const newBranchId = nextId(lastBranchId);
      return reader
        .setCurrentBranch(newBranchId)
        .setBranchName(newBranchId, branchName)
        .setCommitted(newBranchId, reader.currentStateId)
        .setFirst(newBranchId, reader.currentStateId)
        .setLatest(newBranchId, reader.currentStateId)
        .setLastBranchId(newBranchId);
    }),
  };
}
