import * as React from 'react';
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators';
import StateListContainer from './StateListContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DagComponentActions from '../../../state/actions/creators';
import { IHistoryContainerSharedProps } from '../interfaces';
import { IBookmark } from '../../../interfaces';

const { PropTypes } = React;

export interface IChronologicalHistoryViewStateProps {
}

export interface IChronologicalHistoryViewDispatchProps {
  onBranchSelect: Function;
  onStateSelect: Function;
  onAddBookmark: Function;
  onRemoveBookmark: Function;
  onToggleBranchContainer: Function;
  onHighlightSuccessors: Function;
  onUndo: Function;
  onRedo: Function;
  onSkipToStart: Function;
  onSkipToEnd: Function;
  onRenameBranch: Function;
}

export interface IChronologicalHistoryViewOwnProps extends IHistoryContainerSharedProps {
  bookmarks: IBookmark[];
}

export interface IChronologicalHistoryViewProps extends
  IChronologicalHistoryViewStateProps,
  IChronologicalHistoryViewDispatchProps,
  IChronologicalHistoryViewOwnProps {
}

const ChronologicalHistoryView: React.StatelessComponent<IChronologicalHistoryViewProps> = props => (
  <div className="history-container" style={{flex: 1}}>
    <StateListContainer
      {...props}
      branchTypeOverride={'current'}
      commitPath={props.history.chronologicalStates}
    />
  </div>
);
ChronologicalHistoryView.propTypes = {
  bookmarks: PropTypes.array.isRequired,

  /**
   * The Dag-History Object
   */
  history: PropTypes.object.isRequired,
  mainView: PropTypes.string.isRequired,
  historyType: PropTypes.string.isRequired,
  getSourceFromState: PropTypes.func.isRequired,
  branchContainerExpanded: PropTypes.bool,
  highlightSuccessorsOf: PropTypes.number,

  /**
   * User Interaction Handlers - loaded by redux
   */
  onBranchSelect: PropTypes.func,
  onStateSelect: PropTypes.func,
  onAddBookmark: PropTypes.func,
  onRemoveBookmark: PropTypes.func,
  onToggleBranchContainer: PropTypes.func,
  onHighlightSuccessors: PropTypes.func,
  onUndo: PropTypes.func,
  onRedo: PropTypes.func,
  onSkipToStart: PropTypes.func,
  onSkipToEnd: PropTypes.func,
  onRenameBranch: PropTypes.func,

  /**
   * Bookmark Configuration Properties
   */
  bookmarksEnabled: PropTypes.bool,
};

export default connect<IChronologicalHistoryViewStateProps, IChronologicalHistoryViewDispatchProps, IChronologicalHistoryViewOwnProps>(
  () => ({}),
  dispatch => bindActionCreators({
    onBranchSelect: DagHistoryActions.jumpToLatestOnBranch,
    onStateSelect: DagHistoryActions.jumpToState,
    onAddBookmark: DagComponentActions.addBookmark,
    onRemoveBookmark: DagComponentActions.removeBookmark,
    onUndo: DagHistoryActions.undo,
    onRedo: DagHistoryActions.redo,
    onSkipToStart: DagHistoryActions.skipToStart,
    onSkipToEnd: DagHistoryActions.skipToEnd,
    onRenameBranch: DagHistoryActions.renameBranch,
    onHighlightSuccessors: DagComponentActions.pinState,
    onToggleBranchContainer: DagComponentActions.toggleBranchContainer,
  }, dispatch)
)(ChronologicalHistoryView);
