import { mount, configure } from 'enzyme'
import * as React from 'react'
import PlaybackPane from '../../../src/components/PlaybackPane'
import * as Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('The PlaybackPane Component', () => {
	it('can be mounted', () => {
		const rendered = mount(
			<PlaybackPane
				text="Hello!"
				depth={10}
				highlight={0}
				bookmarkDepth={1}
				bookmarkHighlight={0}
			/>,
		)

		const html = rendered.html()
		expect(html.indexOf('Hello!')).toBeGreaterThanOrEqual(0)
	})
})
