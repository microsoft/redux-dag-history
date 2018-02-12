import { BranchId, DagHistory, StateId } from '@essex/redux-dag-history'
import { Bookmark, HistoryType, ComponentView } from '../../interfaces'

export interface HistoryContainerSharedProps {
	history: DagHistory<any>
	pinnedStateId?: StateId
	mainView: ComponentView
	historyType: HistoryType
	dragIndex?: number
	hoverIndex?: number
	bookmarkEditIndex?: number
	branchContainerExpanded?: boolean
	selectedBookmark?: number
	selectedBookmarkDepth?: number
	isPlayingBack?: boolean
	bookmarks: Bookmark[]

	getSourceFromState: Function
	bookmarksEnabled?: boolean

	/**
	 * ControlBar Configuration Properties
	 *
	 * If the controlBar property is undefined, the control bar will be disabled.
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
