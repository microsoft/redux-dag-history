import { mount, configure } from 'enzyme'
import * as React from 'react'
import Continuation from '../../../src/components/Continuation'
import State from '../../../src/components/State'
import { BranchType } from '../../../src/interfaces'
import * as Adapter from 'enzyme-adapter-react-16'
const Bookmark = require('react-icons/lib/io/bookmark')

configure({ adapter: new Adapter() })

describe('The State Component', () => {
	it('can be rendered', () => {
		let rendered = mount(<State id="1" source="abc" label="def" />)
		expect(rendered).toBeDefined()

		rendered = mount(
			<State id="1" label="A State" branchType={BranchType.CURRENT} />,
		)
		expect(rendered).toBeDefined()

		rendered = mount(
			<State
				id="1"
				label="A State"
				branchType={BranchType.CURRENT}
				renderBookmarks={true}
			/>,
		)
		expect(rendered).toBeDefined()

		rendered = mount(
			<State
				id="1"
				label="A State"
				branchType={BranchType.CURRENT}
				renderBookmarks={true}
				bookmarked={true}
			/>,
		)
		expect(rendered).toBeDefined()

		rendered = mount(
			<State
				id="1"
				label="A State"
				branchType={BranchType.CURRENT}
				renderBookmarks={true}
				bookmarked={true}
				pinned={true}
			/>,
		)
		expect(rendered).toBeDefined()

		rendered = mount(
			<State
				id="1"
				label="A State"
				branchType={BranchType.CURRENT}
				renderBookmarks={true}
				bookmarked={true}
				successor={true}
			/>,
		)
		expect(rendered).toBeDefined()
	})

	it('can handle clicks when click handlers are not defined without throwing', () => {
		const rendered = mount(
			<State id="1" label="a state" renderBookmarks={true} />,
		)
		rendered.simulate('click')
		rendered.find(Continuation).simulate('click')
		rendered.find(Bookmark).simulate('click')
	})

	it('can handle clicks', () => {
		let clicked = false
		let continuationClicked = false
		let bookmarkClicked = false
		const rendered = mount(
			<State
				id="1"
				label="a label"
				renderBookmarks={true}
				onClick={() => (clicked = true)}
				onContinuationClick={() => (continuationClicked = true)}
				onBookmarkClick={() => (bookmarkClicked = true)}
			/>,
		)
		rendered.simulate('click')
		expect(clicked).toBeTruthy()
		rendered.find(Continuation).simulate('click')
		expect(continuationClicked).toBeTruthy()
		rendered.find(Bookmark).simulate('click')
		expect(bookmarkClicked).toBeTruthy()
	})
})
