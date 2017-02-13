import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators';
import * as DagComponentActions from '../../../state/actions/creators';
import ExpandCollapseToggle from '../../ExpandCollapseToggle';
import Transport from '../../Transport';
import StateListContainer, { IStateListContainerProps } from './StateListContainer';
import BranchListContainer, { IBranchListContainerProps } from './BranchListContainer';
import { IHistoryContainerSharedProps } from '../interfaces';
import { IBookmark } from '../../../interfaces';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './show-branches-animation.scss';
const { PropTypes } = React;

export interface IBranchedHistoryViewStateProps {
}

export interface IBranchedHistoryViewDispatchProps {
  onStateSelect: (id: number) => void;
  onAddBookmark: Function;
  onBranchSelect: (id: number) => void;
  onRemoveBookmark: Function;
  onToggleBranchContainer: Function;
  onHighlightSuccessors: Function;
  onRenameBranch: Function;
}

export interface IBranchedHistoryViewOwnProps extends IHistoryContainerSharedProps {
}

export interface IBranchedHistoryViewProps extends
  IBranchedHistoryViewStateProps,
  IBranchedHistoryViewDispatchProps,
  IBranchedHistoryViewOwnProps {
  bookmarks: IBookmark[];
}

const BranchedHistoryView: React.StatelessComponent<IBranchedHistoryViewProps> = (props) => {
  const {
    branchContainerExpanded,
    onToggleBranchContainer,
  } = props;
  const branchList = branchContainerExpanded ?
    <BranchListContainer {...props} /> :
    null;

  return (
    <div className="history-container"style={{ flex: 1 }}>
      <StateListContainer {...props} />
      <div className="branch-list-container">
        <div className="history-control-bar">

          <div className="title">Paths</div>
          <ExpandCollapseToggle
            isExpanded={branchContainerExpanded}
            onClick={onToggleBranchContainer}
          />
        </div>
        <ReactCSSTransitionGroup
            transitionName="show-docked-under"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
          {branchList}
        </ReactCSSTransitionGroup>
      </div>
    </div>
  );
};

BranchedHistoryView.propTypes = {
  /**
   * The Dag-History Object
   */
  history: PropTypes.object.isRequired,
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
  onRenameBranch: PropTypes.func,

  /**
   * Bookbark Configuration Properties
   */
  bookmarksEnabled: PropTypes.bool,
};
export default connect<IBranchedHistoryViewStateProps, IBranchedHistoryViewDispatchProps, IBranchedHistoryViewOwnProps>(
  () => ({}),
  dispatch => bindActionCreators({
    onStateSelect: DagHistoryActions.jumpToState,
    onAddBookmark: DagComponentActions.addBookmark,
    onBranchSelect: DagHistoryActions.jumpToBranch,
    onRemoveBookmark: DagComponentActions.removeBookmark,
    onToggleBranchContainer: DagComponentActions.toggleBranchContainer,
    onHighlightSuccessors: DagComponentActions.pinState,
    onRenameBranch: DagHistoryActions.renameBranch,
  }, dispatch)
)(BranchedHistoryView);
