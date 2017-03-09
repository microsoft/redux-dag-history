import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';
import nextId from '../nextId';
import DagGraph from '../DagGraph';

const log = require('debug')('redux-dag-history:DagHistory');

/**
 * Inserts a new state into the history
 */
export default function insert<T>(
  state: T,
  history: IDagHistory<T>,
  config: IConfiguration<T>,
): IDagHistory<T> {
  log('inserting new history state');
  const { graph, lastBranchId } = history;
  if (!graph) {
    throw new Error('History graph is not defined');
  }

  const reader = new DagGraph(graph);
  const parentStateId = reader.currentStateId;
  const currentBranchId = reader.currentBranch;
  const newStateId = nextId(history.lastStateId);
  const newStateName = config.actionName(state, newStateId);
  const cousins = reader.childrenOf(parentStateId);
  const isBranching = cousins.length > 0 || lastBranchId > currentBranchId || currentBranchId === undefined;
  const newBranchId = isBranching ? nextId(lastBranchId) : lastBranchId;

  return {
    ...history,
    current: state,
    lastStateId: newStateId,
    lastBranchId: newBranchId,
    graph: graph.withMutations((g) => {
      const dg = new DagGraph(g)
        .insertState(newStateId, parentStateId, state, newStateName)
        .setCurrentStateId(newStateId);

      // If the state has a hash code, register the state
      if (config.stateKeyGenerator) {
        const stateHash = config.stateKeyGenerator(state);
        log('inserting state with key', stateHash);
        dg.setHashForState(stateHash, newStateId);
      }

      if (isBranching) {
        const newBranch = config.branchName(currentBranchId, newBranchId, newStateName);
        dg.setCurrentBranch(newBranchId)
          .setBranchName(newBranchId, newBranch)
          .setLatest(newBranchId, newStateId)
          .setFirst(newBranchId, newStateId)
          .setCommitted(newBranchId, newStateId)
          .markStateForBranch(newStateId, newBranchId);
      } else {
        dg.setLatest(currentBranchId, newStateId)
          .setCommitted(currentBranchId, newStateId)
          .markStateForBranch(newStateId, currentBranchId);
      }
    }),
  };
}
