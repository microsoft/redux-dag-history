import DagGraph from '@essex/redux-dag-history/lib/DagGraph'
import {
	DagHistory, // eslint-disable-line no-unused-vars
	StateId, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces'

export interface IStateProps {
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
	branchType?: 'current' | 'legacy' | 'unrelated'
	onBookmarkClick?: (state: StateId) => void
	onClick?: (state: StateId) => void
	onContinuationClick?: (state: StateId) => void
	style?: any
}
