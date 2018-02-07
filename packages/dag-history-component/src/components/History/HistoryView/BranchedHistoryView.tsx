import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import { BranchId, StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as React from 'react'
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { IBookmark } from '../../../interfaces'
import * as DagComponentActions from '../../../state/actions/creators'
import ExpandCollapseToggle from '../../ExpandCollapseToggle'
import Transport from '../../Transport'
import { IHistoryContainerSharedProps } from '../interfaces'
import BranchListContainer, {
	IBranchListContainerProps,
} from './BranchListContainer'
import './show-branches-animation.scss'
import StateListContainer, {
	IStateListContainerProps,
} from './StateListContainer'
const { PropTypes } = React

export interface IBranchedHistoryViewStateProps {}

export interface IBranchedHistoryViewDispatchProps {
	onStateSelect: (id: StateId) => void
	onAddBookmark: Function
	onBranchSelect: (id: BranchId) => void
	onRemoveBookmark: Function
	onToggleBranchContainer: Function
	onPinState: Function
	onRenameBranch: Function
}

export interface IBranchedHistoryViewOwnProps
	extends IHistoryContainerSharedProps {}

export interface IBranchedHistoryViewProps
	extends IBranchedHistoryViewStateProps,
		IBranchedHistoryViewDispatchProps,
		IBranchedHistoryViewOwnProps {
	bookmarks: IBookmark[]
}

const BranchedHistoryView: React.StatelessComponent<
	IBranchedHistoryViewProps
> = props => {
	const { branchContainerExpanded, onToggleBranchContainer } = props
	const branchList = branchContainerExpanded ? (
		<BranchListContainer {...props} />
	) : null

	return (
		<div className="history-container" style={{ flex: 1 }}>
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
	)
}

BranchedHistoryView.propTypes = {
	/**
	 * The Dag-History Object
	 */
	history: PropTypes.object.isRequired,
	getSourceFromState: PropTypes.func.isRequired,
	branchContainerExpanded: PropTypes.bool,
	pinnedStateId: PropTypes.string,

	/**
	 * User Interaction Handlers - loaded by redux
	 */
	onBranchSelect: PropTypes.func,
	onStateSelect: PropTypes.func,
	onAddBookmark: PropTypes.func,
	onRemoveBookmark: PropTypes.func,
	onToggleBranchContainer: PropTypes.func,
	onPinState: PropTypes.func,
	onRenameBranch: PropTypes.func,

	/**
	 * Bookbark Configuration Properties
	 */
	bookmarksEnabled: PropTypes.bool,
}
export default connect<
	IBranchedHistoryViewStateProps,
	IBranchedHistoryViewDispatchProps,
	IBranchedHistoryViewOwnProps
>(
	() => ({}),
	dispatch =>
		bindActionCreators(
			{
				onStateSelect: DagHistoryActions.jumpToState,
				onAddBookmark: DagComponentActions.addBookmark,
				onBranchSelect: DagHistoryActions.jumpToBranch,
				onRemoveBookmark: DagComponentActions.removeBookmark,
				onToggleBranchContainer: DagComponentActions.toggleBranchContainer,
				onPinState: DagComponentActions.pinState,
				onRenameBranch: DagHistoryActions.renameBranch,
			},
			dispatch,
		),
)(BranchedHistoryView)
