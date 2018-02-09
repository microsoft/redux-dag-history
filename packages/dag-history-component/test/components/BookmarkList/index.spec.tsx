import { mount } from 'enzyme'
import * as React from 'react'
import Bookmark from '../../../src/components/Bookmark'
import BookmarkList from '../../../src/components/BookmarkList'

xdescribe('The BookmarkList Component', () => {
	it('can render a set of bookmarks', () => {
		const rendered = mount(
			<BookmarkList
				onBookmarkEdit={() => undefined}
				onBookmarkEditDone={() => undefined}
				bookmarks={[
					{
						index: 0,
						stateId: 1,
						name: 'Bookmark 1',
						annotation: 'Anno 1',
						active: true,
					},
					{
						index: 1,
						stateId: 2,
						name: 'Bookmark 2',
						annotation: 'Anno 2',
						active: false,
					},
					{
						index: 2,
						stateId: 3,
						name: 'Bookmark 3',
						annotation: 'Anno 3',
						active: false,
					},
				]}
			/>,
		)
		expect(rendered.find('.history-bookmark').length).toEqual(3)
		expect(rendered).toBeDefined()
	})

	xit('can propagate up bookmark clicks', () => {
		let clickedIndex = null
		let clickedStateId = null
		const rendered = mount(
			<BookmarkList
				onBookmarkEdit={() => undefined}
				onBookmarkEditDone={() => undefined}
				onBookmarkClick={(index, stateId) => {
					clickedIndex = index
					clickedStateId = stateId
				}}
				bookmarks={[
					{
						index: 0,
						stateId: 1,
						name: 'Bookmark 1',
						annotation: 'Anno 1',
						active: true,
					},
					{
						index: 1,
						stateId: 2,
						name: 'Bookmark 2',
						annotation: 'Anno 2',
						active: false,
					},
					{
						index: 2,
						stateId: 3,
						name: 'Bookmark 3',
						annotation: 'Anno 3',
						active: false,
					},
				]}
			/>,
		)

		rendered
			.find(Bookmark)
			.at(1)
			.simulate('click')
		expect(clickedIndex).toEqual(1)
		expect(clickedStateId).toEqual(2)
	})

	it('can handle click events when no handler is defined', () => {
		const rendered = mount(
			<BookmarkList
				onBookmarkEdit={() => undefined}
				onBookmarkEditDone={() => undefined}
				bookmarks={[
					{
						index: 0,
						stateId: 1,
						name: 'Bookmark 1',
						annotation: 'Anno 1',
						active: true,
					},
				]}
			/>,
		)
		rendered
			.find(Bookmark)
			.at(0)
			.simulate('click')
	})
})
