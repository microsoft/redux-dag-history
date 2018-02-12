import { StateId } from '@essex/redux-dag-history'

export interface Bookmark {
	stateId: StateId
	name: string
	data: { [name: string]: any }
}

export enum BranchType {
	CURRENT = 'current',
	LEGACY = 'legacy',
	UNRELATED = 'unrelated',
}

export enum HistoryType {
	BRANCHED = 'branched',
	CHRONOLOGICAL = 'chronological',
}

export enum ComponentView {
	HISTORY = 'history',
	STORYBOARDING = 'storyboarding',
}
