import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { HistoryTypeDropdown } from '../../../src/components/HistoryTypeDropdown'
import { BranchType, HistoryType } from '../../../src/interfaces'
const { action } = require('@storybook/addon-actions')

storiesOf('HistoryTypeDropdown', module).add('With two options', () => (
	<div
		style={{
			flex: 1,
			width: '100%',
			height: 500,
			backgroundColor: 'lightblue',
		}}
	>
		<HistoryTypeDropdown
			historyType={HistoryType.BRANCHED}
			onSelectionChanged={action('selection changed')}
		/>
	</div>
))
