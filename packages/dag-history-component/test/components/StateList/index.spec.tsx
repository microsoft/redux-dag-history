import { mount } from 'enzyme'
import * as React from 'react'
import Continuation from '../../../src/components/Continuation'
import State from '../../../src/components/State'
import StateList from '../../../src/components/StateList'
const Bookmark = require('react-icons/lib/io/bookmark')

xdescribe('The StateList component', () => {
	it('can render a set of states', () => {
		let rendered = mount(<StateList states={[]} />)
		expect(rendered.find(State).length).toEqual(0)

		let stateClicked = null
		let continuationClicked = null
		let bookmarkClicked = null
		rendered = mount(
			<StateList
				states={
					[
						{
							id: 100,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'current',
							continuation: {},
						},
						{
							id: 200,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'current',
							continuation: {},
						},
						{
							id: 300,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'legacy',
							continuation: {},
						},
					] as any
				}
				renderBookmarks={true}
				onStateClick={id => (stateClicked = id)}
				onStateContinuationClick={id => (continuationClicked = id)}
				onStateBookmarkClick={id => (bookmarkClicked = id)}
			/>,
		)
		expect(rendered.find(State).length).toEqual(3)
		const lastState = rendered.find(State).at(2)

		// Click on the state
		lastState.simulate('click')
		expect(stateClicked).toEqual(300)

		// Click on the continuation
		lastState.find(Continuation).simulate('click')
		expect(continuationClicked).toEqual(300)

		// Click on the Bookmark
		lastState.find(Bookmark).simulate('click')
		expect(bookmarkClicked).toEqual(300)
	})

	it('can handle state clicks when no handlers are defined without throwing', () => {
		const rendered = mount(
			<StateList
				states={
					[
						{
							id: 100,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'current',
							continuation: {},
						},
						{
							id: 200,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'current',
							continuation: {},
						},
						{
							id: 300,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'legacy',
							continuation: {},
						},
					] as any
				}
				renderBookmarks={true}
			/>,
		)
		expect(rendered.find(State).length).toEqual(3)
		const lastState = rendered.find(State).at(2)

		// Click on the state
		lastState.simulate('click')

		// Click on the continuation
		lastState.find(Continuation).simulate('click')

		// Click on the Bookmark
		lastState.find(Bookmark).simulate('click')
	})

	it('can render a set of states without bookmarks', () => {
		const rendered = mount(
			<StateList
				states={
					[
						{
							id: 100,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'current',
							continuation: {},
						},
						{
							id: 200,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'current',
							continuation: {},
						},
						{
							id: 300,
							source: 'A Component',
							label: 'Did a Thing',
							branchType: 'legacy',
							continuation: {},
						},
					] as any
				}
			/>,
		)
		expect(rendered.find(Bookmark).length).toEqual(0)
	})
})
