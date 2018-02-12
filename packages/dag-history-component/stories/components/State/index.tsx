import { storiesOf } from '@storybook/react'
import * as React from 'react'
import State from '../../../src/components/State'
import { BranchType } from '../../../src/interfaces'
const { action } = require('@storybook/addon-actions')

storiesOf('State', module)
	.add('Current, Active', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.CURRENT}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={4}
			active={true}
		/>
	))
	.add('Current, Inactive', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.CURRENT}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={2}
		/>
	))
	.add('Legacy, Active', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.LEGACY}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={1}
			active={true}
		/>
	))
	.add('Legacy, Inactive', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.LEGACY}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={12}
		/>
	))
	.add('Current, Unbookmarked', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.CURRENT}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={2}
			renderBookmarks={true}
		/>
	))
	.add('Legacy, Unbookmarked', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.LEGACY}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={2}
			renderBookmarks={true}
		/>
	))
	.add('Current, Bookmarked', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.CURRENT}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={2}
			renderBookmarks={true}
			bookmarked={true}
		/>
	))
	.add('Legacy, Bookmarked', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.LEGACY}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={2}
			renderBookmarks={true}
			bookmarked={true}
		/>
	))
	.add('Pinned', () => (
		<State
			id="1"
			source="Search Widget"
			label="Added Search Criteria"
			branchType={BranchType.CURRENT}
			onClick={action('click')}
			onContinuationClick={action('continuationClick')}
			numChildren={12}
			pinned={true}
		/>
	))
