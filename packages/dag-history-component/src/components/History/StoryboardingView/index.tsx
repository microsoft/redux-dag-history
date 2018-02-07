import * as DagHistoryActions from '@essex/redux-dag-history/lib/ActionCreators'
import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import { DagHistory } from '@essex/redux-dag-history/lib/interfaces'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../state/actions/creators'
import Transport from '../../Transport'
import makeActions from '../BookmarkActions'
import BookmarkListContainer, {
	IBookmarkListContainerProps,
} from './BookmarkListContainer'
const { PropTypes } = React
import { IBookmark } from '../../../interfaces'
import Bookmark from '../../../util/Bookmark'

export interface IStoryboardingViewStateProps {}

export interface IStoryboardingViewDispatchProps {
	onStartPlayback: Function
	onStopPlayback: Function
	onSelectBookmarkDepth: Function
}
export interface IStoryboardingViewOwnProps {
	history: DagHistory<any>
	selectedBookmark?: number
	selectedBookmarkDepth?: number
	bookmarks: IBookmark[]
	dragIndex?: number
	hoverIndex?: number
	bookmarkEditIndex?: number
}

export interface IStoryboardingViewProps
	extends IStoryboardingViewStateProps,
		IStoryboardingViewDispatchProps,
		IStoryboardingViewOwnProps {}

const StoryboardingView: React.StatelessComponent<
	IStoryboardingViewProps & IBookmarkListContainerProps
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

	const bookmark = new Bookmark(bookmarks[0], new DagGraph(history.graph))
	const initialDepth = bookmark.startingDepth()
	const stateId = bookmark.commitPath[bookmark.sanitizeDepth(initialDepth)]

	return (
		<div className="history-container">
			<BookmarkListContainer {...props} />
			<Transport
				onBack={handleStepBack}
				onForward={handleStepForward}
				onPlay={() => onStartPlayback({ initialDepth, stateId })}
				onStop={onStopPlayback}
				onStepBack={handleStepBack}
				onStepForward={handleStepForward}
			/>
		</div>
	)
}

StoryboardingView.propTypes = {
	/**
	 * The Dag-History Object
	 */
	history: PropTypes.object.isRequired,
	selectedBookmark: PropTypes.number,
	selectedBookmarkDepth: PropTypes.number,
	dragIndex: PropTypes.number,
	hoverIndex: PropTypes.number,
	dragKey: PropTypes.string,

	/* User Interaction Handlers - loaded by redux */
	onPlayBookmarkStory: PropTypes.func,
	onSkipToFirstBookmark: PropTypes.func,
	onSkipToLastBookmark: PropTypes.func,
	onNextBookmark: PropTypes.func,
	onPreviousBookmark: PropTypes.func,
	onSelectBookmarkDepth: PropTypes.func,
}

export default connect<
	IStoryboardingViewStateProps,
	IStoryboardingViewDispatchProps,
	IStoryboardingViewOwnProps
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
