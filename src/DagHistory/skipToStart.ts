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

export default function skipToStart<T>(history: IDagHistory<T>): IDagHistory<T> {
  const { graph } = history;
  const reader = new DagGraph(graph);

  let result = reader.currentStateId;
  while (reader.parentOf(result) !== null) {
    result = reader.parentOf(result);
  }
  return jumpToState(result, history);
}
