import {
	BranchId,
	StateId,
	ActionCreators as DagHistoryActions,
} from '@essex/redux-dag-history'
import * as React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Bookmark } from '../../../interfaces'
import * as DagComponentActions from '../../../state/actions/creators'
import ExpandCollapseToggle from '../../ExpandCollapseToggle'
import Transport from '../../Transport'
import { HistoryContainerSharedProps } from '../interfaces'
import BranchListContainer, {
	BranchListContainerProps,
} from '../../BranchListContainer'
import StateListContainer, {
	StateListContainerProps,
} from '../../StateListContainer'
import {
	BranchListContainerEl,
	HistoryControlBar,
	HistoryControlBarTitle,
} from '../styled'
import HistoryContainer from '../../HistoryContainer'

export interface BranchedHistoryViewDispatchProps {
	onStateSelect: (id: StateId) => void
	onAddBookmark: Function
	onBranchSelect: (id: BranchId) => void
	onRemoveBookmark: Function
	onToggleBranchContainer: Function
	onPinState: Function
	onRenameBranch: Function
}

export interface BranchedHistoryViewProps
	extends BranchedHistoryViewDispatchProps,
		HistoryContainerSharedProps {
	bookmarks: Bookmark[]
}

const BranchedHistoryView: React.StatelessComponent<
	BranchedHistoryViewProps
> = props => {
	const { branchContainerExpanded, onToggleBranchContainer } = props
	const branchList = branchContainerExpanded ? (
		<CSSTransition
			classNames="show-docked-under"
			timeout={{ enter: 250, exit: 250 }}
		>
			<BranchListContainer {...props} />
		</CSSTransition>
	) : null

	return (
		<HistoryContainer>
			<StateListContainer {...props} />
			<BranchListContainerEl>
				<HistoryControlBar>
					<HistoryControlBarTitle>Paths</HistoryControlBarTitle>
					<ExpandCollapseToggle
						isExpanded={branchContainerExpanded}
						onClick={onToggleBranchContainer}
					/>
				</HistoryControlBar>
				<TransitionGroup>{branchList}</TransitionGroup>
			</BranchListContainerEl>
		</HistoryContainer>
	)
}

export default connect<{}, BranchedHistoryViewDispatchProps, {}>(
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
