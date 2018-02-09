import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import { DagHistory, StateId } from '@essex/redux-dag-history/lib/interfaces'
import { BranchType } from '../../interfaces'

export interface StateProps {
	id: StateId
	active?: boolean
	renderBookmarks?: boolean
	pinned?: boolean
	successor?: boolean
	state?: any
	source?: string
	label: string
	numChildren?: number
	bookmarked?: boolean
	showContinuation?: boolean
	branchType?: BranchType
	onBookmarkClick?: (state: StateId) => void
	onClick?: (state: StateId) => void
	onContinuationClick?: (state: StateId) => void
	style?: any
}
