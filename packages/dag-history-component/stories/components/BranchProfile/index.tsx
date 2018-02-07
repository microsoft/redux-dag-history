import { storiesOf } from '@kadira/storybook'
import * as React from 'react'
import BranchProfile from '../../../src/components/BranchProfile'

storiesOf('BranchProfile', module)
	.add('1/2 Selected', () => (
		<BranchProfile
			start={0}
			end={1}
			max={1}
			activeStateIndex={0}
			type="current"
		/>
	))
	.add('2/2 Selected', () => (
		<BranchProfile
			start={0}
			end={1}
			max={1}
			activeStateIndex={1}
			type="current"
		/>
	))
	.add('1/3 Selected', () => (
		<BranchProfile
			start={0}
			end={2}
			max={2}
			activeStateIndex={0}
			type="current"
		/>
	))
	.add('2/3 Selected', () => (
		<BranchProfile
			start={0}
			end={2}
			max={2}
			activeStateIndex={1}
			type="current"
		/>
	))
	.add('3/3 Selected', () => (
		<BranchProfile
			start={0}
			end={2}
			max={2}
			activeStateIndex={2}
			type="current"
		/>
	))
	.add('Current Branch with Active State', () => (
		<BranchProfile
			start={0}
			end={10}
			max={10}
			branchStart={0}
			branchEnd={10}
			activeStateIndex={9}
			type="current"
		/>
	))
	.add('Legacy Branch with Active State', () => (
		<BranchProfile
			start={0}
			end={10}
			max={10}
			branchStart={0}
			branchEnd={5}
			activeStateIndex={9}
			type="legacy"
		/>
	))
