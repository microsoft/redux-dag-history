import {
  IDagHistory,
  StateId,
  BranchId,
} from '../interfaces';
import load from './load';

const log = require('debug')('redux-dag-history:DagHistory');

export default function createHistory<T>(
  initialState: T = {} as T,
  initialBranchName: string = 'Initial',
  initialStateName: string = 'Initial',
): IDagHistory<T> {
  log('creating history');
  const currentStateId = 1;
  const currentBranchId = 1;
  return load<T>({
    current: initialState,
    lastStateId: currentStateId,
    lastBranchId: currentBranchId,
    stateHash: new Map<string, any>(), // eslint-disable-line new-parens
    chronologicalStates: [currentStateId],
    graph: {
      current: {
        state: currentStateId,
        branch: currentBranchId,
      },
      branches: {
        [currentBranchId]: {
          latest: currentStateId,
          name: initialBranchName,
          first: currentStateId,
          committed: currentStateId,
        },
      },
      states: {
        [currentStateId]: {
          state: initialState,
          name: initialStateName,
          branch: 1,
          parent: null,
        },
      },
    },
  });
}
