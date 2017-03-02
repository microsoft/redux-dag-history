import * as React from 'react';
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators';
import { IDagHistory } from '@essex/redux-dag-history/lib/interfaces';
import { connect } from 'react-redux';
import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import { bindActionCreators } from 'redux';
import Transport from '../../Transport';
import * as Actions from '../../../state/actions/creators';
import BookmarkListContainer, { IBookmarkListContainerProps } from './BookmarkListContainer';
import makeActions from '../BookmarkActions';
const { PropTypes } = React;
import Bookmark from '../../../util/Bookmark';
import { IBookmark } from '../../../interfaces';

export interface IStoryboardingViewStateProps {}

export interface IStoryboardingViewDispatchProps {
  onStartPlayback: Function;
  onStopPlayback: Function;
  onSelectBookmarkDepth: Function;
}
export interface IStoryboardingViewOwnProps {
  history: IDagHistory<any>;
  selectedBookmark?: number;
  selectedBookmarkDepth?: number;
  bookmarks: IBookmark[];
  dragIndex?: number;
  hoverIndex?: number;
}

export interface IStoryboardingViewProps extends
  IStoryboardingViewStateProps,
  IStoryboardingViewDispatchProps,
  IStoryboardingViewOwnProps {
}

const StoryboardingView: React.StatelessComponent<IStoryboardingViewProps & IBookmarkListContainerProps> = (props) => {
  const {
    history,
    bookmarks,
    onStartPlayback,
    onStopPlayback,
    selectedBookmark,
    selectedBookmarkDepth,
    onSelectBookmarkDepth,
    dragIndex,
    hoverIndex,
  } = props;

  const {
    handleStepBack,
    handleStepForward,
    handleNextBookmark,
    handlePreviousBookmark,
    handleStepBackUnbounded,
  } = makeActions(selectedBookmark, selectedBookmarkDepth, history, bookmarks, onSelectBookmarkDepth);

  const initialDepth = new Bookmark(bookmarks[0], new DagGraph(history.graph)).startingDepth();
  return (
    <div className="history-container">
      <BookmarkListContainer {...props} />
      <Transport
        onBack={handleStepBack}
        onForward={handleStepForward}
        onPlay={() => onStartPlayback({ initialDepth })}
        onStop={onStopPlayback}
        onStepBack={handleStepBack}
        onStepForward={handleStepForward}
      />
    </div>
  );
};

StoryboardingView.propTypes = {
  /**
   * The Dag-History Object
   */
  history: PropTypes.object.isRequired,
  selectedBookmark: PropTypes.number,
  selectedBookmarkDepth: PropTypes.number,
  dragIndex: PropTypes.number,
  hoverIndex: PropTypes.number,
  dragKey: PropTypes.string,

  /* User Interaction Handlers - loaded by redux */
  onPlayBookmarkStory: PropTypes.func,
  onSkipToFirstBookmark: PropTypes.func,
  onSkipToLastBookmark: PropTypes.func,
  onNextBookmark: PropTypes.func,
  onPreviousBookmark: PropTypes.func,
  onSelectBookmarkDepth: PropTypes.func,
};

export default connect<IStoryboardingViewStateProps, IStoryboardingViewDispatchProps, IStoryboardingViewOwnProps>(
  () => ({}),
  dispatch => bindActionCreators({
    onStartPlayback: Actions.startPlayback,
    onStopPlayback: Actions.stopPlayback,
    onSelectBookmarkDepth: Actions.selectBookmarkDepth,
  }, dispatch)
)(StoryboardingView);
