import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StateId } from '@essex/redux-dag-history/lib/interfaces';
import { IBookmark } from '../interfaces';
import {default as HistoryComponent, IHistoryOwnProps, IHistoryDispatchProps } from './History';
import '../daghistory.scss';
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators';
import * as Actions from '../state/actions/creators';

const { PropTypes } = React;

export interface IHistoryContainerStateProps {
  history?: any;
  mainView?: string;
  historyType?: string;
  branchContainerExpanded?: boolean;
  pinnedStateId?: StateId;
  selectedBookmark?: number;
  selectedBookmarkDepth?: number;
  bookmarks?: IBookmark[];
}

export interface IHistoryContainerDispatchProps extends IHistoryDispatchProps {
}

export interface IHistoryContainerOwnProps {
  bookmarksEnabled?: boolean;
  controlBarEnabled?: boolean;

  /**
   * ControlBar Configuration Properties
   */
  controlBar?: {
    /**
     * A handler to save the history tree out. This is handled by clients.
     */
    onSaveHistory: Function;

    /**
     * A handler to retrieve the history tree. This is handled by clients
     */
    onLoadHistory: Function;

    /**
     * A function that emits a Promise<boolean> that confirms the clear-history operation.
     */
    onConfirmClear: Function;
  };

  getSourceFromState: Function;
}

export interface IHistoryContainerProps extends
  IHistoryContainerStateProps,
  IHistoryContainerDispatchProps,
  IHistoryContainerOwnProps {
}

const HistoryContainer: React.StatelessComponent<IHistoryContainerProps> = (props) => {
  return (<HistoryComponent {...props} />);
};
HistoryContainer.propTypes = {
  ...HistoryComponent.propTypes,
};

export default function createHistoryContainer(getMiddlewareState: Function, getComponentState: Function) {
  const mapStateToProps = (state) => {
    const middleware = getMiddlewareState(state);
    const component = getComponentState(state);
    return {
      // State from the redux-dag-history middleware
      history: middleware,
      pinnedStateId: component.pinnedState.id,

      // State from the dag-history-component
      bookmarks: component.bookmarks,
      mainView: component.views.mainView,
      historyType: component.views.historyType,
      dragIndex: component.dragDrop.sourceIndex,
      dragKey: component.dragDrop.sourceKey,
      hoverIndex: component.dragDrop.hoverIndex,
      bookmarkEditIndex: component.bookmarkEdit.editIndex,
      branchContainerExpanded: component.views.branchContainerExpanded,
      selectedBookmark: component.playback.bookmark,
      selectedBookmarkDepth: component.playback.depth,
      isPlayingBack: component.playback.isPlayingBack,
    };
  };
  const mapDispatchToProps = (dispatch) => bindActionCreators({
    onClear: DagHistoryActions.clear,
    onLoad: DagHistoryActions.load,
    onSelectMainView: Actions.selectMainView,
    onSelectState: DagHistoryActions.jumpToState,
    onToggleBranchContainer: Actions.toggleBranchContainer,
    onStartPlayback: Actions.startPlayback,
    onStopPlayback: Actions.stopPlayback,
    onSelectBookmarkDepth: Actions.selectBookmarkDepth,
  }, dispatch);
  return connect<IHistoryContainerStateProps, IHistoryContainerDispatchProps, IHistoryContainerOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(HistoryContainer);
};
