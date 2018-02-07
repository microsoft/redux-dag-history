
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import { BranchId, StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as React from 'react'
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Bookmark } from '../../../interfaces'
import * as DagComponentActions from '../../../state/actions/creators'
import ExpandCollapseToggle from '../../ExpandCollapseToggle'
import Transport from '../../Transport'
import { HistoryContainerSharedProps } from '../interfaces'
import BranchListContainer, {
	BranchListContainerProps,
} from './BranchListContainer'
import './show-branches-animation.scss'
import StateListContainer, {
	StateListContainerProps,
} from './StateListContainer'

export interface BranchedHistoryViewStateProps {}

export interface BranchedHistoryViewDispatchProps {
	onStateSelect: (id: StateId) => void
	onAddBookmark: Function
	onBranchSelect: (id: BranchId) => void
	onRemoveBookmark: Function
	onToggleBranchContainer: Function
	onPinState: Function
	onRenameBranch: Function
}

export interface BranchedHistoryViewOwnProps
	extends HistoryContainerSharedProps {}

export interface BranchedHistoryViewProps
	extends BranchedHistoryViewStateProps,
		BranchedHistoryViewDispatchProps,
		BranchedHistoryViewOwnProps {
	bookmarks: Bookmark[]
}

const BranchedHistoryView: React.StatelessComponent<
	BranchedHistoryViewProps
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

export default connect<
	BranchedHistoryViewStateProps,
	BranchedHistoryViewDispatchProps,
	BranchedHistoryViewOwnProps
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
