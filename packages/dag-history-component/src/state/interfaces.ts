import {
	Configuration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces'

export interface ComponentConfiguration<T> extends Configuration<T> {
	initialViewState: {
		mainView?: string
		historyType?: string
		branchContainerExpanded?: boolean
	}
}

export type RawComponentConfiguration<T> = {
	[P in keyof ComponentConfiguration<T>]?: ComponentConfiguration<T>[P]
}
