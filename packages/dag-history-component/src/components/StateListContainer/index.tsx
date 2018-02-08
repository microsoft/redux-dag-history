import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import { DagHistory, StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as debug from 'debug'
import * as React from 'react'
import { Bookmark } from '../../interfaces'
import isNumber from '../../util/isNumber'
import StateList from '../StateList'

const log = debug('dag-history-component:components:HistoryView')

function getCurrentCommitPath(historyGraph: DagGraph<any>) {
	const { currentBranch } = historyGraph
	const latestCommitOnBranch = historyGraph.latestOn(currentBranch)
	return historyGraph.commitPath(latestCommitOnBranch)
}

function getStateList(
	historyGraph: DagGraph<any>,
	commitPath: StateId[],
	bookmarks: any[],
	pinnedStateId: StateId,
	getSourceFromState: Function,
	chronological: boolean,
) {
	const { currentBranch, currentStateId } = historyGraph

	const activeBranchStartsAt = historyGraph.branchStartDepth(currentBranch)
	const isBookmarked = id => bookmarks.map(b => b.stateId).includes(id)

	//
	// Transform state-ids into data that is used to render the states in the StateList view
	//
	const getStateData = (
		id,
		index,
		isSuccessor?: boolean,
		isCurrentBranchSuccessor?: boolean,
	) => {
		let branchType = index < activeBranchStartsAt ? 'legacy' : 'current'
		if (isSuccessor && !isCurrentBranchSuccessor) {
			branchType = 'unrelated'
		}
		const numChildren = historyGraph.childrenOf(id).length
		const label = historyGraph.stateName(id)
		const state = historyGraph.getState(id)
		const pinned = pinnedStateId === id
		const active = currentStateId === id
		const source = getSourceFromState(state)

		return {
			id,
			state,
			numChildren,
			label,
			source,
			bookmarked: isBookmarked(id),
			successor: isSuccessor,
			showContinuation: !chronological && !isSuccessor,
			pinned,
			active,
			branchType,
			historyGraph,
			getSourceFromState,
		} as any
	}

	//
	// If a state has been "pinned", then want to view it's successors. We will insert them after the pinned state ID, and
	// remove the current branch successor.
	//
	const commitPathData = commitPath.map((id, index) => getStateData(id, index))
	if (pinnedStateId !== undefined) {
		// If the pinned state doesn't have any children, don't bother
		const pinnedStateIndex = commitPath.indexOf(pinnedStateId)
		if (pinnedStateIndex < commitPath.length - 1) {
			// Get data for the children of the pinned state.
			const currentBranchSuccessor: StateId = commitPath[pinnedStateIndex + 1]
			const pinnedChildren = pinnedStateId
				? historyGraph.childrenOf(pinnedStateId)
				: []
			const pinnedChildrenData = pinnedChildren.map((id, index) =>
				getStateData(
					id,
					pinnedStateIndex + 1,
					true,
					currentBranchSuccessor === id,
				),
			)

			// Remove the natural child in the current branch's commit path,
			// since it will be presented as a child of the current state.
			commitPathData.splice(pinnedStateIndex + 1, 1, ...pinnedChildrenData)
		}
	}
	return commitPathData
}

export interface StateListContainerProps {
	history: DagHistory<any>
	commitPath?: StateId[]
	getSourceFromState: Function
	branchContainerExpanded?: boolean
	pinnedStateId?: StateId
	bookmarksEnabled?: boolean
	branchTypeOverride?: string
	bookmarks: Bookmark[]
	chronological?: boolean

	/**
	 * User Interaction Handlers - loaded by redux
	 */
	onStateSelect: Function
	onAddBookmark: Function
	onRemoveBookmark: Function
	onPinState: Function
}

const StateListContainer: React.StatelessComponent<StateListContainerProps> = ({
	history: { graph },
	bookmarks,
	commitPath,
	onPinState,
	onRemoveBookmark,
	onAddBookmark,
	onStateSelect,
	bookmarksEnabled,
	pinnedStateId,
	getSourceFromState,
	branchTypeOverride,
	chronological,
}) => {
	const historyGraph = new DagGraph(graph)
	const commitPathtoUse = commitPath || getCurrentCommitPath(historyGraph)
	const { currentStateId } = historyGraph

	const onStateContinuationClick = id => onPinState(id)
	const onStateBookmarkClick = id => {
		log('bookmarking state %s', id)
		const bookmarked = bookmarks.map(b => b.stateId).includes(id)
		log('bookmarked?', bookmarked)
		return bookmarked
			? onRemoveBookmark(id)
			: onAddBookmark({ stateId: id, name: historyGraph.stateName(id) })
	}

	const stateList = getStateList(
		historyGraph,
		commitPathtoUse,
		bookmarks,
		pinnedStateId,
		getSourceFromState,
		chronological,
	)
	if (branchTypeOverride) {
		stateList.forEach(s => (s.branchType = branchTypeOverride))
	}

	return (
		<StateList
			activeStateId={currentStateId}
			states={stateList}
			onStateClick={onStateSelect}
			onStateContinuationClick={onStateContinuationClick}
			onStateBookmarkClick={onStateBookmarkClick}
			renderBookmarks={bookmarksEnabled}
		/>
	)
}

export default StateListContainer
