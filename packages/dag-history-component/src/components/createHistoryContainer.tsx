import {
	BranchId,
	DagHistory,
	StateId,
} from '@essex/redux-dag-history/lib/interfaces'
import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Bookmark } from '../interfaces'
import * as Actions from '../state/actions/creators'
import HistoryComponent from './History'

export interface HistoryContainerStateProps {
	history?: DagHistory<any>
	mainView?: string
	historyType?: string
	branchContainerExpanded?: boolean
	pinnedStateId?: StateId
	selectedBookmark?: number
	selectedBookmarkDepth?: number
	bookmarks?: Bookmark[]
	getSourceFromState: Function
}

export interface HistoryContainerOwnProps {
	bookmarksEnabled?: boolean

	/**
	 * ControlBar Configuration Properties
	 */
	controlBar?: {
		/**
		 * A handler to save the history tree out. This is handled by clients.
		 */
		onSaveHistory: Function

		/**
		 * A handler to retrieve the history tree. This is handled by clients
		 */
		onLoadHistory: Function

		/**
		 * A function that emits a Promise<boolean> that confirms the clear-history operation.
		 */
		onConfirmClear: Function
	}
}

export interface HistoryContainerProps
	extends HistoryContainerStateProps,
		HistoryContainerOwnProps {}

const HistoryContainer: React.StatelessComponent<
	HistoryContainerProps
	// TODO: Hacky, figure out the typings here
> = props => <HistoryComponent {...props as any} />

// HACK: these unused expressions sidesteps webpack's tree-shaking from pruning these imports
bindActionCreators // tslint:disable-line no-unused-expression
Actions // tslint:disable-line no-unused-expression
DagHistoryActions // tslint:disable-line no-unused-expression

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
	bindActionCreators(
		{
			onClear: DagHistoryActions.clear,
			onLoad: DagHistoryActions.load,
			onSelectMainView: Actions.selectMainView,
			onSelectState: DagHistoryActions.jumpToState,
			onToggleBranchContainer: Actions.toggleBranchContainer,
			onStartPlayback: Actions.startPlayback,
			onStopPlayback: Actions.stopPlayback,
			onSelectBookmarkDepth: Actions.selectBookmarkDepth,
		},
		dispatch,
	)

export default function createHistoryContainer(
	getMiddlewareState: Function,
	getComponentState: Function,
	getSourceFromState: Function,
) {
	const mapStateToProps = (state: any) => {
		const middleware = getMiddlewareState(state)
		const component = getComponentState(state)
		return {
			getSourceFromState,

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
		}
	}
	return connect<HistoryContainerStateProps, {}, HistoryContainerOwnProps>(
		mapStateToProps,
		mapDispatchToProps,
	)(HistoryContainer)
}
