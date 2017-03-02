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
  const currentStateId: StateId = undefined;
  const currentBranchId: BranchId = undefined;
  return load<T>({
    current: initialState,
    lastStateId: 0,
    lastBranchId: 0,
    stateHash: new Map<StateId, any>(), // eslint-disable-line new-parens
    chronologicalStates: [],
    graph: {
      current: {
        state: currentStateId,
        branch: currentBranchId,
      },
      branches: {},
      states: {},
    },
  });
}
