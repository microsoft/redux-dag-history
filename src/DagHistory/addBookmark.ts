import DagGraph from '../DagGraph';
import {
  IDagHistory,
  StateId,
  IConfiguration,
} from '../interfaces';

const log = require('debug')('redux-dag-history:DagHistory');

export default function addBookmark<T>(
  stateId: StateId,
  history: IDagHistory<T>,
  config: IConfiguration<T>
): IDagHistory<T> {
  log('adding bookmark on state %s', stateId);
  const { graph } = history;
  const reader = new DagGraph(graph);
  const stateName = reader.stateName(stateId);
  return {
    ...history,
    bookmarks: [
      ...history.bookmarks, {
        stateId,
        name: config.bookmarkName(stateId, stateName),
        data: {},
      },
    ],
  };
}
