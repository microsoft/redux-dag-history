import * as Immutable from 'immutable';
import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function replaceCurrentState<T>(
  state: any,
  history: IDagHistory<T>,
  config: IConfiguration<T>,
): IDagHistory<T> {
  log('replace current state');
  const { graph, stateHash } = history;
  const reader = new DagGraph(graph);
  const currentStateId = reader.currentStateId;

  // If the state has a hash code, register the state
  if (config.stateKeyGenerator) {
    const hash = config.stateKeyGenerator(state);

    log('inserting state with key', hash);
    history.stateHash.set(hash, currentStateId);
  }

  return {
    ...history,
    current: state,
    stateHash,
    graph: graph.withMutations(g => new DagGraph(g).replaceState(currentStateId, state)),
  };
}
