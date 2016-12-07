import * as Immutable from 'immutable';
import DagGraph from '../DagGraph';
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from '../interfaces';
import jumpToState from './jumpToState';

const log = require('debug')('redux-dag-history:DagHistory');

export default function skipToEnd<T>(history: IDagHistory<T>): IDagHistory<T> {
  const { graph } = history;
  const reader = new DagGraph(graph);

  const path = reader.branchCommitPath(reader.currentBranch);
  const result = path[path.length - 1];
  return jumpToState(result, history);
}
