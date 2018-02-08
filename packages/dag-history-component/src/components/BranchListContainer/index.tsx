import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import {
	BranchId,
	DagHistory,
	StateId,
} from '@essex/redux-dag-history/lib/interfaces'
import * as debug from 'debug'
import * as React from 'react'
import isNumber from '../../util/isNumber'
import BranchList from '../BranchList'
import { BranchType } from '../../interfaces'
const log = debug('dag-history-component:components:HistoryView')

function getCurrentCommitPath(historyGraph: DagGraph<any>) {
	const { currentBranch } = historyGraph
	const latestCommitOnBranch = historyGraph.latestOn(currentBranch)
	return historyGraph.commitPath(latestCommitOnBranch)
}

export interface BranchListContainerProps {
	history: DagHistory<any>
	pinnedStateId?: StateId
	onRenameBranch: Function
	onBranchSelect: (id: BranchId) => void
	style?: any
}

export default class BranchListContainer extends React.Component<
	BranchListContainerProps
> {
	public getBranchList(historyGraph: DagGraph<any>, commitPath: string[]) {
		const { branches, currentBranch, currentStateId } = historyGraph
		const { pinnedStateId: pinnedState, onRenameBranch } = this.props
		const pinnedStateBranch = historyGraph.branchOf(pinnedState)

		// Determine what branches are on the commit path
		const branchPaths = {}
		const branchPath = commitPath.map(commit => historyGraph.branchOf(commit))
		branchPath.forEach((branch, index) => {
			if (branchPaths[branch]) {
				branchPaths[branch].end = index
			} else {
				branchPaths[branch] = { start: index, end: index }
			}
		})

		// This is a hash of branchId -> stateId
		const selectedSuccessorsByBranch = {}
		if (pinnedState !== undefined) {
			historyGraph.childrenOf(pinnedState).forEach(child => {
				const branch = historyGraph.branchOf(child)
				selectedSuccessorsByBranch[branch] = child
			})
		}

		const getSuccessorDepth = branch => {
			const successorId = selectedSuccessorsByBranch[branch]
			return successorId ? historyGraph.depthIndexOf(branch, successorId) : null
		}

		const getPinnedStateDepth = branch => {
			if (pinnedState !== undefined || pinnedStateBranch !== branch) {
				return null
			}
			return historyGraph.depthIndexOf(branch, pinnedState)
		}

		const activeStateBranch = historyGraph.branchOf(currentStateId)
		const activeStateIndex = historyGraph.depthIndexOf(
			activeStateBranch,
			currentStateId,
		)

		let maxDepth = 0
		const branchData = {}
		branches.forEach(branch => {
			const startsAt = historyGraph.branchStartDepth(branch)
			const endsAt = historyGraph.branchEndDepth(branch)
			const length = endsAt - startsAt
			maxDepth = Math.max(maxDepth, length)
			branchData[branch] = {
				startsAt,
				endsAt,
				length,
			}
		})

		return branches
			.sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
			.map(branch => {
				const { startsAt, endsAt } = branchData[branch]
				const branchType =
					currentBranch === branch ? BranchType.CURRENT : BranchType.LEGACY
				const label = historyGraph.getBranchName(branch)
				const showActiveStateIndex =
					currentBranch === branch || activeStateBranch === branch

				// Figure out where this branch intersects the commit path
				const myBranchPath = branchPaths[branch]
				const currentBranchStart = myBranchPath ? myBranchPath.start : null
				const currentBranchEnd = myBranchPath ? myBranchPath.end : null
				const successorDepth =
					pinnedState === undefined ? undefined : getSuccessorDepth(branch)
				const pinnedStateIndex = getPinnedStateDepth(branch)

				return {
					id: branch,
					active: currentBranch === branch,
					label,
					activeStateIndex: showActiveStateIndex ? activeStateIndex : null,
					startsAt,
					endsAt,
					maxDepth,
					branchType,
					currentBranchStart,
					currentBranchEnd,
					successorDepth,
					pinnedStateIndex,
					onRename: name => onRenameBranch({ branch, name }),
				}
			})
			.filter(
				branch =>
					!pinnedState || branch.active || isNumber(branch.successorDepth),
			)
			.reverse()
	}

	public render() {
		const { history: { graph }, style } = this.props
		const historyGraph = new DagGraph(graph)
		const commitPath = getCurrentCommitPath(historyGraph)
		const { currentBranch } = historyGraph
		const { onBranchSelect } = this.props
		const onBranchContinuationClick = id =>
			log('branch continuation clicked', id)
		const branchList = this.getBranchList(historyGraph, commitPath)
		return (
			<BranchList
				style={style}
				activeBranch={currentBranch}
				branches={branchList}
				onBranchClick={onBranchSelect}
			/>
		)
	}
}
