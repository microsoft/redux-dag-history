import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import { DagHistory } from '@essex/redux-dag-history/lib/interfaces'
import * as debug from 'debug'
import * as React from 'react'
import { IBookmark } from '../../interfaces'
import Bookmark from '../../util/Bookmark'
import isNumber from '../../util/isNumber'
import PlaybackPane from '../PlaybackPane'
import Transport from '../Transport'
import makeActions from './BookmarkActions'
import HistoryTabs from './HistoryTabs'
import HistoryView from './HistoryView'
import { IHistoryContainerSharedProps } from './interfaces'
import StoryboardingView from './StoryboardingView'

import './History.scss'

const { PropTypes } = React

const log = debug('dag-history-component:components:History')

export interface IHistoryStateProps {}
export interface IHistoryDispatchProps {
	onLoad?: Function
	onClear?: Function
	onSelectMainView: Function
	onToggleBranchContainer?: Function
	onStartPlayback?: Function
	onStopPlayback?: Function
	onSelectBookmarkDepth?: Function
	onSelectState?: Function
}
export interface IHistoryOwnProps extends IHistoryContainerSharedProps {}

export interface IHistoryProps
	extends IHistoryStateProps,
		IHistoryDispatchProps,
		IHistoryOwnProps {}

export default class History extends React.Component<IHistoryProps, {}> {
	public static propTypes = {
		bookmarks: PropTypes.array.isRequired,
		dragIndex: PropTypes.number,
		dragKey: PropTypes.string,
		hoverIndex: PropTypes.number,
		bookmarkEditIndex: PropTypes.number,
		isPlayingBack: PropTypes.bool,

		/**
		 * The Dag-History Object
		 */
		history: PropTypes.object.isRequired,
		mainView: PropTypes.string.isRequired,
		historyType: PropTypes.string.isRequired,
		getSourceFromState: PropTypes.func.isRequired,
		branchContainerExpanded: PropTypes.bool,
		pinnedStateId: PropTypes.string,
		selectedBookmark: PropTypes.number,
		selectedBookmarkDepth: PropTypes.number,

		/**
		 * User Interaction Handlers - loaded by redux
		 */
		onLoad: PropTypes.func,
		onClear: PropTypes.func,
		onSelectMainView: PropTypes.func.isRequired,
		onToggleBranchContainer: PropTypes.func,
		onStartPlayback: PropTypes.func,
		onStopPlayback: PropTypes.func,
		onSelectState: PropTypes.func,

		/**
		 * ControlBar Configuration Properties
		 */
		controlBar: PropTypes.shape({
			/**
			 * A handler to save the history tree out. This is handled by clients.
			 */
			onSaveHistory: PropTypes.func,

			/**
			 * A handler to retrieve the history tree. This is handled by clients
			 */
			onLoadHistory: PropTypes.func,

			/**
			 * A function that emits a Promise<boolean> that confirms the clear-history operation.
			 */
			onConfirmClear: PropTypes.func,
		}),

		/**
		 * Bookbark Configuration Properties
		 */
		bookmarksEnabled: PropTypes.bool,
	}

	public shouldComponentUpdate(nextProps) {
		return this.props !== nextProps
	}

	public onSaveClicked() {
		const { history, controlBar: { onSaveHistory }, bookmarks } = this.props
		const { current, graph } = history
		// Pass the plain history up to the client to save
		onSaveHistory({
			current,
			lastBranchId: graph.get('lastBranchId'),
			lastStateId: graph.get('lastStateId'),
			bookmarks,
			graph: graph.toJS(),
		})
	}

	public async onLoadClicked() {
		log('history load clicked')
		const { onLoad, controlBar: { onLoadHistory } } = this.props
		if (!onLoadHistory) {
			throw new Error("Cannot load history, 'onLoadHistory' must be defined")
		}
		const state = await onLoadHistory()
		if (!state) {
			throw new Error(
				"'onLoadHistory' must return either a state graph object or a promise that resolves to a state graph object",
			)
		}
		onLoad(state)
	}

	public async onClearClicked() {
		const { onClear, controlBar: { onConfirmClear } } = this.props
		log('clearing history')
		const doConfirm = onConfirmClear || (() => true)
		const confirmed = await doConfirm()
		return confirmed && onClear()
	}

	public renderPlayback() {
		const {
			history,
			onStartPlayback,
			onStopPlayback,
			selectedBookmark,
			selectedBookmarkDepth,
			onSelectBookmarkDepth,
			onSelectState,
			bookmarks,
		} = this.props

		const { graph } = history
		const historyGraph = new DagGraph(graph)
		const bookmark = bookmarks[selectedBookmark]
		const slideText =
			bookmark.data.annotation || bookmark.name || 'No Slide Data'
		const numLeadInStates = bookmark.data.numLeadInStates
		const bookmarkPath = historyGraph.shortestCommitPath(bookmark.stateId)

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

		const bookmarkHighlight =
			selectedBookmarkDepth !== undefined
				? selectedBookmarkDepth
				: bookmarkPath.length - 1

		const initialDepth = new Bookmark(
			bookmarks[0],
			new DagGraph(history.graph),
		).startingDepth()

		// End the presentation if we're on the last slide
		return (
			<div className="state-list-container">
				<PlaybackPane
					text={slideText}
					depth={bookmarks.length}
					highlight={selectedBookmark}
					bookmarkDepth={bookmarkPath.length}
					bookmarkHighlight={bookmarkHighlight}
					bookmarkNumLeadInStates={numLeadInStates}
					onDiscoveryTrailIndexClicked={selectedIndex => {
						const target = bookmarkPath[selectedIndex]
						onSelectBookmarkDepth({
							target,
							depth: selectedIndex,
							state: target,
						})
						onSelectState(target)
					}}
				/>
				<Transport
					playing
					onStepBack={handleStepBackUnbounded}
					onStepForward={handleStepForward}
					onBack={handleStepBack}
					onForward={handleStepForward}
					onPlay={() => onStartPlayback({ initialDepth })}
					onStop={onStopPlayback}
				/>
			</div>
		)
	}

	public render() {
		const {
			mainView,
			onSelectMainView,
			bookmarksEnabled,
			isPlayingBack,
			controlBar,
		} = this.props
		return isPlayingBack ? (
			this.renderPlayback()
		) : (
			<HistoryTabs
				bookmarksEnabled={bookmarksEnabled}
				controlBarEnabled={!!controlBar}
				selectedTab={mainView}
				onTabSelect={onSelectMainView}
				historyView={<HistoryView {...this.props} />}
				storyboardingView={<StoryboardingView {...this.props} />}
				onSaveClicked={this.onSaveClicked.bind(this)}
				onLoadClicked={this.onLoadClicked.bind(this)}
				onClearClicked={this.onClearClicked.bind(this)}
			/>
		)
	}
}
