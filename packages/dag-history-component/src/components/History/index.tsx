import * as React from 'react';
import { IDagHistory } from '@essex/redux-dag-history/lib/interfaces';
import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import HistoryTabs from './HistoryTabs';
import Transport from '../Transport';
import PlaybackPane from '../PlaybackPane';
import HistoryView from './HistoryView';
import StoryboardingView from './StoryboardingView';
import { IHistoryContainerSharedProps } from './interfaces';
import isNumber from '../../util/isNumber';
import makeActions from './BookmarkActions';
import Bookmark from '../../util/Bookmark';
import { IBookmark } from '../../interfaces';

import './History.scss';

const { PropTypes } = React;

const log = require('debug')('dag-history-component:components:History');

export interface IHistoryStateProps {}
export interface IHistoryDispatchProps {
  onLoad?: Function;
  onClear?: Function;
  onSelectMainView: Function;
  onToggleBranchContainer?: Function;
  onStartPlayback?: Function;
  onStopPlayback?: Function;
  onSelectBookmarkDepth?: Function;
  onSelectState?: Function;
}
export interface IHistoryOwnProps extends IHistoryContainerSharedProps {
}

export interface IHistoryProps extends IHistoryStateProps, IHistoryDispatchProps, IHistoryOwnProps {}

export default class History extends React.Component<IHistoryProps, {}> {
  public static propTypes = {
    bookmarks: PropTypes.array.isRequired,
    dragIndex: PropTypes.number,
    dragKey: PropTypes.string,
    hoverIndex: PropTypes.number,
    isPlayingBack: PropTypes.bool,

    /**
     * The Dag-History Object
     */
    history: PropTypes.object.isRequired,
    mainView: PropTypes.string.isRequired,
    historyType: PropTypes.string.isRequired,
    getSourceFromState: PropTypes.func.isRequired,
    branchContainerExpanded: PropTypes.bool,
    pinnedStateId: PropTypes.string,
    selectedBookmark: PropTypes.number,
    selectedBookmarkDepth: PropTypes.number,

    /**
     * User Interaction Handlers - loaded by redux
     */
    onLoad: PropTypes.func,
    onClear: PropTypes.func,
    onSelectMainView: PropTypes.func.isRequired,
    onToggleBranchContainer: PropTypes.func,
    onStartPlayback: PropTypes.func,
    onStopPlayback: PropTypes.func,
    onSelectState: PropTypes.func,

    /**
     * ControlBar Configuration Properties
     */
    controlBar: PropTypes.shape({
      /**
       * A handler to save the history tree out. This is handled by clients.
       */
      onSaveHistory: PropTypes.func,

      /**
       * A handler to retrieve the history tree. This is handled by clients
       */
      onLoadHistory: PropTypes.func,

      /**
       * A function that emits a Promise<boolean> that confirms the clear-history operation.
       */
      onConfirmClear: PropTypes.func,
    }),

    /**
     * Bookbark Configuration Properties
     */
    bookmarksEnabled: PropTypes.bool,
    controlBarEnabled: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  onSaveClicked() {
    const { history, controlBar: { onSaveHistory }, bookmarks } = this.props;
    const { current, lastBranchId, lastStateId, graph } = history;
    // Pass the plain history up to the client to save
    onSaveHistory({
      current,
      lastBranchId,
      lastStateId,
      bookmarks,
      graph: graph.toJS(),
    });
  }

  async onLoadClicked() {
    log('history load clicked');
    const { onLoad, controlBar: { onLoadHistory } } = this.props;
    if (!onLoadHistory) {
      throw new Error('Cannot load history, \'onLoadHistory\' must be defined');
    }
    const state = await onLoadHistory();
    if (!state) {
      throw new Error('\'onLoadHistory\' must return either a state graph object or a promise that resolves to a state graph object');
    }
    onLoad(state);
  }

  async onClearClicked() {
    const { onClear, controlBar: { onConfirmClear } } = this.props;
    log('clearing history');
    const doConfirm = onConfirmClear || (() => true);
    const confirmed = await doConfirm();
    return confirmed && onClear();
  }

  onUnderViewClicked(underView) {
    log('underview clicked', underView);
    this.setState({ ...this.state, underView });
  }

  renderPlayback() {
    const {
      history,
      onStartPlayback,
      onStopPlayback,
      selectedBookmark,
      selectedBookmarkDepth,
      onSelectBookmarkDepth,
      onSelectState,
      bookmarks,
    } = this.props;

    const {
      graph,
    } = history;
    const historyGraph = new DagGraph(graph);
    const bookmark = bookmarks[selectedBookmark];
    const slideText = bookmark.data['annotation'] || bookmark.name || 'No Slide Data';
    const numLeadInStates = bookmark.data['numLeadInStates'];
    const bookmarkPath = historyGraph.shortestCommitPath(bookmark.stateId);

    const {
      handleStepBack,
      handleStepForward,
      handleNextBookmark,
      handlePreviousBookmark,
      handleStepBackUnbounded,
    } = makeActions(selectedBookmark, selectedBookmarkDepth, history, bookmarks, onSelectBookmarkDepth);

    const bookmarkHighlight = (selectedBookmarkDepth !== undefined) ?
      selectedBookmarkDepth :
      bookmarkPath.length - 1;

    const initialDepth = new Bookmark(bookmarks[0], new DagGraph(history.graph)).startingDepth();

    // End the presentation if we're on the last slide
    return (
      <div className="state-list-container">
        <PlaybackPane
          text={slideText}
          depth={bookmarks.length}
          highlight={selectedBookmark}
          bookmarkDepth={bookmarkPath.length}
          bookmarkHighlight={bookmarkHighlight}
          bookmarkNumLeadInStates={numLeadInStates}
          onDiscoveryTrailIndexClicked={selectedIndex => {
            const target = bookmarkPath[selectedIndex];
            onSelectBookmarkDepth({ target, depth: selectedIndex, state: target });
            onSelectState(target);
          }}
        />
        <Transport
          playing
          onStepBack={handleStepBackUnbounded}
          onStepForward={handleStepForward}
          onBack={handleStepBack}
          onForward={handleStepForward}
          onPlay={() => onStartPlayback({ initialDepth })}
          onStop={onStopPlayback}
        />
      </div>
    );
  }

  render() {
    const {
      mainView,
      onSelectMainView,
      bookmarksEnabled,
      controlBarEnabled,
      isPlayingBack,
    } = this.props;
    return isPlayingBack ? this.renderPlayback() : (
      <HistoryTabs
        bookmarksEnabled={bookmarksEnabled}
        controlBarEnabled={controlBarEnabled}
        selectedTab={mainView}
        onTabSelect={onSelectMainView}
        historyView={<HistoryView {...this.props} />}
        storyboardingView={<StoryboardingView {...this.props} />}
        onSaveClicked={this.onSaveClicked.bind(this)}
        onLoadClicked={this.onLoadClicked.bind(this)}
        onClearClicked={this.onClearClicked.bind(this)}
      />
    );
  }
}
