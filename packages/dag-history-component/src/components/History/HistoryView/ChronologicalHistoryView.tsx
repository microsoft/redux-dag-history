
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Bookmark } from '../../../interfaces'
import * as DagComponentActions from '../../../state/actions/creators'
import { HistoryContainerSharedProps } from '../interfaces'
import StateListContainer from './StateListContainer'

export interface ChronologicalHistoryViewDispatchProps {
	onBranchSelect: Function
	onStateSelect: Function
	onAddBookmark: Function
	onRemoveBookmark: Function
	onToggleBranchContainer: Function
	onPinState: Function
	onUndo: Function
	onRedo: Function
	onSkipToStart: Function
	onSkipToEnd: Function
	onRenameBranch: Function
}

export interface ChronologicalHistoryViewOwnProps
	extends HistoryContainerSharedProps {
	bookmarks: Bookmark[]
}

export interface ChronologicalHistoryViewProps
	extends ChronologicalHistoryViewDispatchProps,
		ChronologicalHistoryViewOwnProps {}

const ChronologicalHistoryView: React.StatelessComponent<
	ChronologicalHistoryViewProps
> = props => (
	<div className="history-container" style={{ flex: 1 }}>
		<StateListContainer
			{...props}
			chronological={true}
			branchTypeOverride={'current'}
			commitPath={props.history.graph.get('chronologicalStates').toJS()}
		/>
	</div>
)

export default connect<
	{},
	ChronologicalHistoryViewDispatchProps,
	ChronologicalHistoryViewOwnProps
>(
	() => ({}),
	dispatch =>
		bindActionCreators(
			{
				onBranchSelect: DagHistoryActions.jumpToLatestOnBranch,
				onStateSelect: DagHistoryActions.jumpToState,
				onAddBookmark: DagComponentActions.addBookmark,
				onRemoveBookmark: DagComponentActions.removeBookmark,
				onUndo: DagHistoryActions.undo,
				onRedo: DagHistoryActions.redo,
				onSkipToStart: DagHistoryActions.skipToStart,
				onSkipToEnd: DagHistoryActions.skipToEnd,
				onRenameBranch: DagHistoryActions.renameBranch,
				onPinState: DagComponentActions.pinState,
				onToggleBranchContainer: DagComponentActions.toggleBranchContainer,
			},
			dispatch,
		),
)(ChronologicalHistoryView)
