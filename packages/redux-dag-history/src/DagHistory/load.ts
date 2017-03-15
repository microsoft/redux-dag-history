import { fromJS, Map } from 'immutable';
import { IDagHistory } from '../interfaces';
import DagGraph from '../DagGraph';

export default function load<T>(history: any): IDagHistory<T> {
  // Immutabilize the history graph, sans the physical states that are present
  const copiedGraph = {...history.graph};
  delete copiedGraph.physicalStates;
  let graph = fromJS(copiedGraph) as Map<string, any>;

  // Insert the states into the dag graph, we do this dance so we don't accidentally turn raw JS to immutable
  Object.keys(history.graph.physicalStates).forEach(state => {
    graph = graph.setIn(['physicalStates', `${state}`], history.graph.physicalStates[state]);
  });

  return {
    ...history,
    graph,
  };
}
