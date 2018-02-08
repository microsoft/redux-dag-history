import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import { DagHistory } from '@essex/redux-dag-history/lib/interfaces'
import * as debug from 'debug'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Bookmark } from '../../interfaces'
import * as Actions from '../../state/actions/creators'
import BookmarkList from '../BookmarkList'

const log = debug('dag-history-component:components:StoryboardingView')

export interface BookmarkListContainerStateProps {
	dragIndex?: number
	hoverIndex?: number
	dragKey?: string
	bookmarkEditIndex?: number
}

export interface BookmarkListContainerDispatchProps {
	onSelectBookmark: Function
	onBookmarkChange: Function
	onSelectState: Function
	onSelectBookmarkDepth: Function
	onBookmarkEdit: Function
	onBookmarkEditDone: Function
}

export interface BookmarkListContainerOwnProps {
	history: DagHistory<any>
	selectedBookmark?: number
	selectedBookmarkDepth?: number
	bookmarks: Bookmark[]
}

export interface BookmarkListContainerProps
	extends BookmarkListContainerStateProps,
		BookmarkListContainerDispatchProps,
		BookmarkListContainerOwnProps {}

const BookmarkListContainer: React.StatelessComponent<
	BookmarkListContainerProps
> = (props: BookmarkListContainerProps) => {
	const {
		history: { graph },
		bookmarks,
		onSelectBookmark,
		onBookmarkChange,
		onSelectState,
		onSelectBookmarkDepth,
		onBookmarkEdit,
		onBookmarkEditDone,
		bookmarkEditIndex,
		selectedBookmark: selectedBookmarkIndex,
		selectedBookmarkDepth: selectedBookmarkDepthIndex,
		dragIndex,
		hoverIndex,
		dragKey,
	} = props
	const historyGraph = new DagGraph(graph)
	const { currentStateId } = historyGraph

	const bookmarkData = bookmarks.map((b, index) => {
		const { stateId } = b
		// The bookmark is selected if it's the currently defined selection (the user has clicked on it) or
		// if the user has not clicked on a bookmark yet, and this bookmark represents the current state.
		const isForCurrentState = b.stateId === currentStateId
		const active =
			selectedBookmarkIndex === index ||
			(selectedBookmarkIndex === undefined && isForCurrentState)

		const shortestCommitPath = historyGraph.shortestCommitPath(b.stateId)
		let selectedDepth
		if (active) {
			selectedDepth = selectedBookmarkDepthIndex
		} else {
			const currentStateIndex = shortestCommitPath.indexOf(currentStateId)
			selectedDepth = currentStateIndex === -1 ? undefined : currentStateIndex
		}
		return {
			...b,
			active,
			annotation: b.data.annotation || '',
			numLeadInStates: b.data.numLeadInStates,
			onBookmarkChange: ({ name, data }) =>
				onBookmarkChange({ stateId, name, data }),
			shortestCommitPath,
			selectedDepth,
		}
	})
	return (
		<BookmarkList
			onBookmarkEdit={onBookmarkEdit}
			onBookmarkEditDone={onBookmarkEditDone}
			bookmarkEditIndex={bookmarkEditIndex}
			dragIndex={dragIndex}
			hoverIndex={hoverIndex}
			dragKey={dragKey}
			bookmarks={bookmarkData}
			onBookmarkClick={(index, state) => onSelectBookmark(index, state)}
			onSelectState={onSelectState}
			onSelectBookmarkDepth={onSelectBookmarkDepth}
		/>
	)
}

export default connect<
	BookmarkListContainerStateProps,
	BookmarkListContainerDispatchProps,
	BookmarkListContainerOwnProps
>(
	() => ({}),
	dispatch =>
		bindActionCreators(
			{
				onSelectBookmark: Actions.selectBookmark,
				onBookmarkChange: Actions.changeBookmark,
				onSelectState: DagHistoryActions.jumpToState,
				onSelectBookmarkDepth: Actions.selectBookmarkDepth,
				onBookmarkEdit: Actions.bookmarkEdit,
				onBookmarkEditDone: Actions.bookmarkEditDone,
			},
			dispatch,
		),
)(BookmarkListContainer)
