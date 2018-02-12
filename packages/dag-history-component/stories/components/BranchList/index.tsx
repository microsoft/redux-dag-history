import { storiesOf } from '@storybook/react'
import * as React from 'react'
import BranchList from '../../../src/components/BranchList'
import { BranchType } from '../../../src/interfaces'

storiesOf('BranchList', module).add('Basic example', () => (
	<BranchList
		activeBranch="1"
		branches={[
			{
				id: '0',
				label: 'delta-1',
				startsAt: 5,
				endsAt: 10,
				maxDepth: 10,
				branchType: BranchType.CURRENT,
			},
			{
				id: '1',
				activeStateIndex: 3,
				label: 'master',
				startsAt: 0,
				endsAt: 4,
				maxDepth: 10,
				branchType: BranchType.LEGACY,
			},
		]}
	/>
))
