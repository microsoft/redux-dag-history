
import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import { DagHistory } from '@essex/redux-dag-history/lib/interfaces'
import * as debug from 'debug'
import * as React from 'react'
import { Bookmark as BookmarkPayload } from '../../interfaces'
import Bookmark from '../../util/Bookmark'
import isNumber from '../../util/isNumber'
import PlaybackPane from '../PlaybackPane'
import Transport from '../Transport'
import makeActions from './BookmarkActions'
import HistoryTabs from './HistoryTabs'
import HistoryView from './HistoryView'
import { HistoryContainerSharedProps } from './interfaces'
import StoryboardingView from './StoryboardingView'

import './History.scss'

const log = debug('dag-history-component:components:History')

export interface HistoryStateProps {}
export interface HistoryDispatchProps {
	onLoad?: Function
	onClear?: Function
	onSelectMainView: Function
	onToggleBranchContainer?: Function
	onStartPlayback?: Function
	onStopPlayback?: Function
	onSelectBookmarkDepth?: Function
	onSelectState?: Function
}
export interface HistoryOwnProps extends HistoryContainerSharedProps {}

export interface HistoryProps
	extends HistoryStateProps,
		HistoryDispatchProps,
		HistoryOwnProps {}

export default class History extends React.Component<HistoryProps, {}> {
	public shouldComponentUpdate(nextProps: HistoryProps) {
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
					playing={true}
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
