import { Configuration } from '@essex/redux-dag-history/lib/interfaces'
import { ComponentView, HistoryType } from '../interfaces'

export interface ComponentConfiguration<T> extends Configuration<T> {
	initialViewState: {
		mainView?: ComponentView
		historyType?: HistoryType
		branchContainerExpanded?: boolean
	}
}

export type RawComponentConfiguration<T> = {
	[P in keyof ComponentConfiguration<T>]?: ComponentConfiguration<T>[P]
}
