import * as React from 'react';
import State from './State';
import { IExpandableStateProps } from './interfaces';
import StateWithSuccessors from './StateWithSuccessors';
import { IContinuationProps } from '../Continuation';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const ExpandableState: React.StatelessComponent<IExpandableStateProps> = (props) => {
  const {
    id,
    pinned,
    active,
    isBookmarked,
    branchType,
    historyGraph,
    getSourceFromState,
    onClick,
    onContinuationClick,
    onBookmarkClick,
    renderBookmarks,
  } = props;

  const children = historyGraph.childrenOf(id);
  const getSourceAndLabel = (stateId: number) => {
    const state = historyGraph.getState(id);
    const source = getSourceFromState(state);
    const label = historyGraph.stateName(id);
    return { source, label };
  };

  const isExpanded = pinned && children.length > 1;
  const childStates = isExpanded ? children.map(id => ({
    id,
    bookmarked: isBookmarked(id),
    numChildren: historyGraph.childrenOf(id).length,
    onClick,
    onContinuationClick,
    onBookmarkClick,
    renderBookmarks,
    showContinuation: false,
    ...getSourceAndLabel(id),
  })) : [];

  const stateProps = {
    id,
    pinned,
    active,
    bookmarked: isBookmarked(id),
    branchType,
    onClick,
    onContinuationClick,
    onBookmarkClick,
    numChildren: children.length,
    renderBookmarks,
    ...getSourceAndLabel(id),
    childStates,
  };
  return (<StateWithSuccessors {...stateProps} />);
};
export default ExpandableState;
