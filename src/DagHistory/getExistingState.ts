import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';
import DagGraph from '../DagGraph';

const log = require('debug')('redux-dag-history:DagHistory');

/**
 * When a state is being inserted into the system, we can optionally check to see if it's
 * a duplicate of an existing state. We perform a hash check and an equality check to
 * determine if the state is, in fact, a duplicate.
 */
export default function getExistingState<T>(
  newState: T,
  history: IDagHistory<T>,
  config: IConfiguration<T>,
): StateId {
  if (config.stateKeyGenerator && config.stateEqualityPredicate) {
    const hash = config.stateKeyGenerator(newState);
    const found = history.stateHash.get(hash);
    if (found) {
      const existingState = new DagGraph<T>(history.graph) // eslint-disable-line new-parens
        .getState(found);
      const areEqual = config.stateEqualityPredicate(newState, existingState);
      if (areEqual) {
        return found;
      }
      log('found hashed state not equal');
    } else {
      log('no hashed state found');
    }
  } else {
    log('skip existing state check');
  }
  return null;
}
