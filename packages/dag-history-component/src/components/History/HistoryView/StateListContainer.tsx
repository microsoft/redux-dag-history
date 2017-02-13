import * as React from 'react';
import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import { IDagHistory } from '@essex/redux-dag-history/lib/interfaces';
import StateList from '../../StateList';
import isNumber from '../../../util/isNumber';
import { IBookmark } from '../../../interfaces';

const { PropTypes } = React;

const log = require('debug')('dag-history-component:components:HistoryView');

function getCurrentCommitPath(historyGraph) {
  const { currentBranch } = historyGraph;
  const latestCommitOnBranch = historyGraph.latestOn(currentBranch);
  return historyGraph.commitPath(latestCommitOnBranch);
}

function getStateList(
  historyGraph,
  commitPath,
  bookmarks,
  highlightSuccessorsOf,
  getSourceFromState
) {
  const {
    currentBranch,
    currentStateId,
  } = historyGraph;
  const activeBranchStartsAt = historyGraph.branchStartDepth(currentBranch);
  const isBookmarked = (id) => bookmarks.map(b => b.stateId).includes(id);
  return commitPath.map((id, index) => {
    const branchType = index < activeBranchStartsAt ? 'legacy' : 'current';
    const pinned = highlightSuccessorsOf === id;
    const active = currentStateId === id;
    const successor = isNumber(highlightSuccessorsOf) &&
      historyGraph.parentOf(id) === highlightSuccessorsOf;

    return {
      id,
      isBookmarked,
      pinned,
      active,
      successor,
      branchType,
      historyGraph,
      getSourceFromState,
    };
  });
}

export interface IStateListContainerProps {
  history: IDagHistory<any>;
  commitPath?: number[];
  getSourceFromState: Function;
  branchContainerExpanded?: boolean;
  highlightSuccessorsOf: number;
  bookmarksEnabled?: boolean;
  branchTypeOverride?: string;
  bookmarks: IBookmark[];

  /**
   * User Interaction Handlers - loaded by redux
   */
  onStateSelect: Function;
  onAddBookmark: Function;
  onRemoveBookmark: Function;
  onHighlightSuccessors: Function;
}

const StateListContainer: React.StatelessComponent<IStateListContainerProps> = ({
  history: {
    graph,
  },
  bookmarks,
  commitPath,
  onHighlightSuccessors,
  onRemoveBookmark,
  onAddBookmark,
  onStateSelect,
  bookmarksEnabled,
  highlightSuccessorsOf,
  getSourceFromState,
  branchTypeOverride,
}) => {
  const historyGraph = new DagGraph(graph);
  const commitPathtoUse = commitPath || getCurrentCommitPath(historyGraph);
  const { currentStateId } = historyGraph;

  const onStateContinuationClick = id => onHighlightSuccessors(id);
  const onStateBookmarkClick = (id) => {
    log('bookmarking state %s',
      id,
      bookmarks,
      bookmarks.map(b => b.stateId),
      bookmarks.map(b => b.stateId).includes(id)
    );
    const bookmarked = bookmarks.map(b => b.stateId).includes(id);
    log('bookmarked?', bookmarked);
    return bookmarked ? onRemoveBookmark(id) : onAddBookmark({ stateId: id, name: historyGraph.stateName(id) });
  };
  const stateList = getStateList(
    historyGraph,
    commitPathtoUse,
    bookmarks,
    highlightSuccessorsOf,
    getSourceFromState
  );

  if (branchTypeOverride) {
    stateList.forEach(s => s.branchType = branchTypeOverride);
  }

  return (
    <StateList
      activeStateId={currentStateId}
      states={stateList}
      onStateClick={onStateSelect}
      onStateContinuationClick={onStateContinuationClick}
      onStateBookmarkClick={onStateBookmarkClick}
      renderBookmarks={bookmarksEnabled}
    />
  );
};
StateListContainer.propTypes = {
  /**
   * The Dag-History Object
   */
  history: PropTypes.object.isRequired,
  commitPath: PropTypes.arrayOf(PropTypes.number),
  getSourceFromState: PropTypes.func.isRequired,
  branchContainerExpanded: PropTypes.bool,
  highlightSuccessorsOf: PropTypes.number,
  bookmarksEnabled: PropTypes.bool,
  branchTypeOverride: PropTypes.string,

  /**
   * User Interaction Handlers - loaded by redux
   */
  onStateSelect: PropTypes.func,
  onAddBookmark: PropTypes.func,
  onRemoveBookmark: PropTypes.func,
  onHighlightSuccessors: PropTypes.func,
};

export default StateListContainer;
