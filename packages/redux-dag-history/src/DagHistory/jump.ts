import * as Immutable from 'immutable';
import {
  IDagHistory,
  StateNameGenerator,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';
import DagGraph from '../DagGraph';
import unfreeze from './unfreeze';

const log = require('debug')('redux-dag-history:DagHistory');

//
// Provides state jumping without special rules applied.
// This allows us to share common state-jumping code.
//

/**
 * Jumps to a specific state
 */
export function jump<T>(
  stateId: StateId,
  history: IDagHistory<T>,
  assignObj = {},
  callback: ((g: DagGraph<T>) => void
) = () => ({})): IDagHistory<T> {
  const { graph } = history;
  const reader = new DagGraph(graph);
  const targetState = reader.getState(stateId);
  return {
    ...history,
    ...assignObj,
    current: unfreeze(targetState),
    graph: graph.withMutations((g) => {
      const writer = new DagGraph<T>(g) // eslint-disable-line new-parens
        .setCurrentStateId(stateId);
      callback(writer);
    }),
  };
}

/**
 * Jumps to a specific state, while logging this visitation in the chronological states array.
 */
export function jumpLog<T>(
  stateId: StateId,
  history: IDagHistory<T>,
  assignObj = {},
  callback: ((g: DagGraph<T>) => void
) = () => ({})): IDagHistory<T> {
  const { graph } = history;
  const { currentStateId: alternateParent } = new DagGraph(graph);

  return jump(
    stateId,
    history,
    assignObj,
    (writer) => {
      writer.setAlternateParent(stateId, alternateParent);
      callback(writer);
    });
}
