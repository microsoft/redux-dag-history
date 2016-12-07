import * as Immutable from 'immutable';
import {
  IDagHistory,
  StateNameGenerator,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';
import DagGraph from '../DagGraph';
import jumpToState from './jumpToState';

const log = require('debug')('redux-dag-history:DagHistory');

export default function redo<T>(history: IDagHistory<T>): IDagHistory<T> {
  const { graph } = history;
  const reader = new DagGraph(graph);
  const children = reader
    .childrenOf(reader.currentStateId)
    .filter(child => reader.branchesOf(child).indexOf(reader.currentBranch) !== -1);

  if (children.length > 0) {
    const nextStateId = children[0];
    return jumpToState(nextStateId, history);
  }
  log('cannot redo');
  return history;
}
