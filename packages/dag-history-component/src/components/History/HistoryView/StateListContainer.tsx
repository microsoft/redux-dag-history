import * as React from 'react';
import { StateId } from '@essex/redux-dag-history/lib/interfaces';
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
  historyGraph: DagGraph<any>,
  commitPath: StateId[],
  bookmarks: any[],
  pinnedStateId: StateId,
  getSourceFromState: Function,
) {
  const {
    currentBranch,
    currentStateId,
  } = historyGraph;
  const activeBranchStartsAt = historyGraph.branchStartDepth(currentBranch);
  const isBookmarked = (id) => bookmarks.map(b => b.stateId).includes(id);

  //
  // Transform state-ids into data that is used to render the states in the StateList view
  //
  const getStateData = (id, index, isSuccessor?: boolean, isCurrentBranchSuccessor?: boolean) => {
    let branchType = index < activeBranchStartsAt ? 'legacy' : 'current';
    if (isSuccessor && !isCurrentBranchSuccessor) {
      branchType = 'unrelated';
    }
    const pinned = pinnedStateId === id;
    const active = currentStateId === id;

    return {
      id,
      bookmarked: isBookmarked(id),
      successor: isSuccessor,
      pinned,
      active,
      branchType,
      historyGraph,
      getSourceFromState,
    } as any;
  };

  //
  // If a state has been "pinned", then want to view it's successors. We will insert them after the pinned state ID, and
  // remove the current branch successor.
  //
  const commitPathData = commitPath.map((id, index) => getStateData(id, index));
  if (pinnedStateId !== undefined) {
    // If the pinned state doesn't have any children, don't bother
    const pinnedStateIndex = commitPath.indexOf(pinnedStateId);
    if (pinnedStateIndex < commitPath.length - 1) {
      // Get data for the children of the pinned state.
      const currentBranchSuccessor: StateId = commitPath[pinnedStateIndex + 1];
      const pinnedChildren = pinnedStateId ? historyGraph.childrenOf(pinnedStateId) : [];
      const pinnedChildrenData = pinnedChildren.map((id, index) => getStateData(id, pinnedStateIndex + 1, true, currentBranchSuccessor === id));

      // Remove the natural child in the current branch's commit path, since it will be presented as a child of the current state.
      commitPathData.splice(pinnedStateIndex + 1, 1, ...pinnedChildrenData);
    }
  }
  return commitPathData;
}

export interface IStateListContainerProps {
  history: IDagHistory<any>;
  commitPath?: number[];
  getSourceFromState: Function;
  branchContainerExpanded?: boolean;
  pinnedStateId: number;
  bookmarksEnabled?: boolean;
  branchTypeOverride?: string;
  bookmarks: IBookmark[];

  /**
   * User Interaction Handlers - loaded by redux
   */
  onStateSelect: Function;
  onAddBookmark: Function;
  onRemoveBookmark: Function;
  onPinState: Function;
}

const StateListContainer: React.StatelessComponent<IStateListContainerProps> = ({
  history: {
    graph,
  },
  bookmarks,
  commitPath,
  onPinState,
  onRemoveBookmark,
  onAddBookmark,
  onStateSelect,
  bookmarksEnabled,
  pinnedStateId,
  getSourceFromState,
  branchTypeOverride,
}) => {
  const historyGraph = new DagGraph(graph);
  const commitPathtoUse = commitPath || getCurrentCommitPath(historyGraph);
  const { currentStateId } = historyGraph;

  const onStateContinuationClick = id => onPinState(id);
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
    pinnedStateId,
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
  pinnedStateId: PropTypes.number,
  bookmarksEnabled: PropTypes.bool,
  branchTypeOverride: PropTypes.string,

  /**
   * User Interaction Handlers - loaded by redux
   */
  onStateSelect: PropTypes.func,
  onAddBookmark: PropTypes.func,
  onRemoveBookmark: PropTypes.func,
  onPinState: PropTypes.func,
};

export default StateListContainer;
