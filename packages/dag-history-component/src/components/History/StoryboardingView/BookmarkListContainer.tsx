import * as React from 'react';
import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import { IDagHistory } from '@essex/redux-dag-history/lib/interfaces';
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators';
import * as Actions from '../../../state/actions/creators';
import { IBookmark } from '../../../interfaces';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BookmarkList from '../../BookmarkList';

const log = require('debug')('dag-history-component:components:StoryboardingView');

export interface IBookmarkListContainerStateProps {
  dragIndex?: number;
  hoverIndex?: number;
  dragKey?: number;
}

export interface IBookmarkListContainerDispatchProps {
  onSelectBookmark: Function;
  onBookmarkChange: Function;
  onSelectState: Function;
  onSelectBookmarkDepth: Function;
}

export interface IBookmarkListContainerOwnProps {
  history: IDagHistory<any>;
  selectedBookmark?: number;
  selectedBookmarkDepth?: number;
  bookmarks: IBookmark[];
}

export interface IBookmarkListContainerProps extends
  IBookmarkListContainerStateProps,
  IBookmarkListContainerDispatchProps,
  IBookmarkListContainerOwnProps {
}

const BookmarkListContainer: React.StatelessComponent<IBookmarkListContainerProps> = (props: IBookmarkListContainerProps) => {
  const {
    history: {
      graph,
    },
    bookmarks,
    onSelectBookmark,
    onBookmarkChange,
    onSelectState,
    onSelectBookmarkDepth,
    selectedBookmark: selectedBookmarkIndex,
    selectedBookmarkDepth: selectedBookmarkDepthIndex,
    dragIndex,
    hoverIndex,
    dragKey,
  } = props;
  const historyGraph = new DagGraph(graph);
  const { currentStateId } = historyGraph;

  const bookmarkData = bookmarks.map((b, index) => {
    const { stateId } = b;
    // The bookmark is selected if it's the currently defined selection (the user has clicked on it) or
    // if the user has not clicked on a bookmark yet, and this bookmark represents the current state.
    const isForCurrentState = b.stateId === currentStateId;
    const active = selectedBookmarkIndex === index || (selectedBookmarkIndex === undefined && isForCurrentState);

    const shortestCommitPath = historyGraph.shortestCommitPath(b.stateId);
    let selectedDepth;
    if (active) {
      selectedDepth = selectedBookmarkDepthIndex;
    } else {
      const currentStateIndex = shortestCommitPath.indexOf(currentStateId);
      selectedDepth = currentStateIndex === -1 ? undefined : currentStateIndex;
    }
    return {
      ...b,
      active,
      annotation: b.data['annotation'] || '',
      numLeadInStates: b.data['numLeadInStates'],
      onBookmarkChange: ({ name, data }) => onBookmarkChange({ stateId, name, data }),
      shortestCommitPath,
      selectedDepth,
    };
  });
  return (
    <BookmarkList
      dragIndex={dragIndex}
      hoverIndex={hoverIndex}
      dragKey={dragKey}
      bookmarks={bookmarkData}
      onBookmarkClick={(index, state) => onSelectBookmark(index, state)}
      onSelectState={onSelectState}
      onSelectBookmarkDepth={onSelectBookmarkDepth}
    />
  );
};
BookmarkListContainer.propTypes = {
  bookmarks: React.PropTypes.array.isRequired,
  history: React.PropTypes.object.isRequired,
  onSelectBookmark: React.PropTypes.func.isRequired,
  onBookmarkChange: React.PropTypes.func.isRequired,
  onSelectState: React.PropTypes.func,
  selectedBookmark: React.PropTypes.number,
  selectedBookmarkDepth: React.PropTypes.number,
  dragIndex: React.PropTypes.number,
  dragKey: React.PropTypes.number,
  hoverIndex: React.PropTypes.number,
};

export default connect<IBookmarkListContainerStateProps, IBookmarkListContainerDispatchProps, IBookmarkListContainerOwnProps>(
  () => ({}),
  dispatch => bindActionCreators({
    onSelectBookmark: Actions.selectBookmark,
    onBookmarkChange: Actions.changeBookmark,
    onSelectState: DagHistoryActions.jumpToState,
    onSelectBookmarkDepth: Actions.selectBookmarkDepth,
  }, dispatch)
)(BookmarkListContainer);
