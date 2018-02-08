import { action, storiesOf } from '@storybook/react'
import * as React from 'react'
import Bookmark from '../../../src/components/Bookmark/Bookmark'

storiesOf('Bookmark', module)
	.add('Inactive', () => (
		<Bookmark
			index={0}
			commitPathLength={1}
			name="Some Bookmark Name"
			annotation="Some Bookmark Annotation Text. Derp Depr Derp Derp"
			onClick={action('click')}
		/>
	))
	.add('Active', () => (
		<Bookmark
			index={1}
			commitPathLength={1}
			name="Some Bookmark Name"
			annotation="Some Bookmark Annotation Text. Derp Depr Derp Derp"
			onClick={action('click')}
			active={true}
		/>
	))
