import * as React from 'react';
import State from './State';
import { IExpandableStateProps } from './interfaces';
import { IContinuationProps } from '../Continuation';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const ExpandableState: React.StatelessComponent<IExpandableStateProps> = (props) => {
  const {
    id,
    pinned,
    active,
    bookmarked,
    branchType,
    historyGraph,
    getSourceFromState,
    onClick,
    onContinuationClick,
    onBookmarkClick,
    renderBookmarks,
    successor,
  } = props;

  const children = historyGraph.childrenOf(id);
  const getSourceAndLabel = (stateId: number) => {
    const state = historyGraph.getState(id);
    const source = getSourceFromState(state);
    const label = historyGraph.stateName(id);
    return { source, label };
  };

  const stateProps = {
    id,
    pinned,
    active,
    bookmarked,
    successor,
    branchType,
    onClick,
    onContinuationClick,
    onBookmarkClick,
    numChildren: children.length,
    renderBookmarks,
    ...getSourceAndLabel(id),
  };
  return (<State {...stateProps} />);
};
export default ExpandableState;
