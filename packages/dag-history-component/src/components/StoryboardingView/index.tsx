import {
	DagHistory,
	DagGraph,
	ActionCreators as DagHistoryActions,
} from '@essex/redux-dag-history'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../state/actions/creators'
import Transport from '../Transport'
import makeActions from '../../util/BookmarkActions'
import BookmarkListContainer, {
	BookmarkListContainerProps,
} from './BookmarkListContainer'
import { Bookmark as BookmarkData } from '../../interfaces'
import Bookmark from '../../util/Bookmark'
import HistoryContainer from '../HistoryContainer'

export interface StoryboardingViewDispatchProps {
	onStartPlayback: Function
	onStopPlayback: () => void
	onSelectBookmarkDepth: Function
}
export interface StoryboardingViewOwnProps {
	history: DagHistory<any>
	selectedBookmark?: number
	selectedBookmarkDepth?: number
	bookmarks: Bookmark[]
	dragIndex?: number
	hoverIndex?: number
	bookmarkEditIndex?: number
}

export interface StoryboardingViewProps
	extends StoryboardingViewDispatchProps,
		StoryboardingViewOwnProps {}

const StoryboardingView: React.StatelessComponent<
	StoryboardingViewProps & BookmarkListContainerProps
> = props => {
	const {
		history,
		bookmarks,
		onStartPlayback,
		onStopPlayback,
		selectedBookmark,
		selectedBookmarkDepth,
		onSelectBookmarkDepth,
		dragIndex,
		hoverIndex,
		bookmarkEditIndex,
	} = props

	const {
		handleStepBack,
		handleStepForward,
		handleNextBookmark,
		handlePreviousBookmark,
		handleStepBackUnbounded,
	} = makeActions(
		selectedBookmark,
		selectedBookmarkDepth,
		history,
		bookmarks,
		onSelectBookmarkDepth,
	)

	const onPlay = () => {
		if (bookmarks.length === 0) {
			return
		}
		const bookmark = new Bookmark(bookmarks[0], new DagGraph(history.graph))
		const initialDepth = bookmark.startingDepth()
		const stateId = bookmark.commitPath[bookmark.sanitizeDepth(initialDepth)]

		onStartPlayback({ initialDepth, stateId })
	}

	return (
		<HistoryContainer>
			<BookmarkListContainer {...props} />
			<Transport
				onBack={handleStepBack}
				onForward={handleStepForward}
				onPlay={onPlay}
				onStop={onStopPlayback}
				onStepBack={handleStepBack}
				onStepForward={handleStepForward}
			/>
		</HistoryContainer>
	)
}

export default connect<
	{},
	StoryboardingViewDispatchProps,
	StoryboardingViewOwnProps
>(
	() => ({}),
	dispatch =>
		bindActionCreators(
			{
				onStartPlayback: Actions.startPlayback,
				onStopPlayback: Actions.stopPlayback,
				onSelectBookmarkDepth: Actions.selectBookmarkDepth,
			},
			dispatch,
		),
)(StoryboardingView)
