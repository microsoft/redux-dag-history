import {
  IDagHistory,
  StateId,
  BranchId,
  IConfiguration,
} from '../interfaces';
import load from './load';
import nextId from '../nextId';

const log = require('debug')('redux-dag-history:DagHistory');

export default function createHistory<T>(
  initialState: T = {} as T,
  config: IConfiguration<T>,
): IDagHistory<T> {
  log('creating history');
  const stateId: StateId = nextId();
  const branchId: BranchId = nextId();
  const {
    initialStateName,
    initialBranchName,
  } = config;

  // We may need to insert the initial hash into the state data, so construct it here
  const initialStateData = {
    name: initialStateName,
    branch: 1,
  };

  // If possible, hash the initial state
  let stateHash = {};
  if (config.stateKeyGenerator) {
    const initialHash = config.stateKeyGenerator(initialState);
    stateHash[initialHash] = stateId;
    initialStateData['hash'] = initialHash;
  }

  return load<T>({
    current: initialState,
    graph: {
      /**
       * The last used state id
       */
      lastStateId: stateId,

      /**
       * The last used branch id
       */
      lastBranchId: branchId,

      /**
       * A map of hash-code strings to state IDs. If a has function is defined in
       * the configuration file, then these will be inserted.
       */
      stateHash,

      /**
       * A chronological listing of visited states
       */
      chronologicalStates: [stateId],

      /**
       * The current state and branch
       */
      current: {
        state: stateId,
        branch: branchId,
      },

      /**
       * A map of branch-ids to branch data
       */
      branches: {
        [branchId]: {
          latest: stateId,
          name: initialBranchName,
          first: stateId,
          committed: stateId,
        },
      },

      /**
       * A map of state-ids to state metadata
       */
      states: {
        [stateId]: initialStateData,
      },

      /**
       * A map of state ids to physical states
       */
      physicalStates: {
        [stateId]: initialState,
      },
    },
  });
}
