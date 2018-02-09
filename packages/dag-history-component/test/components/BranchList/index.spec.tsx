import { mount, configure } from 'enzyme'
import * as React from 'react'
import BranchList from '../../../src/components/BranchList'
import { BranchType } from '../../../src/interfaces'
import * as Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('The BranchList component', () => {
	it('can render an empty branch list', () => {
		const rendered = mount(<BranchList activeBranch={null} branches={[]} />)
		expect(rendered).toBeDefined()
	})

	it('can render an non-empty branch list', () => {
		let clickedId = null
		const rendered = mount(
			<BranchList
				activeBranch="5"
				branches={[
					{
						id: '5',
						label: 'delta-1',
						startsAt: 5,
						endsAt: 10,
						maxDepth: 10,
						branchType: BranchType.CURRENT,
					},
				]}
				onBranchClick={id => (clickedId = id)}
			/>,
		)
		expect(rendered).toBeDefined()
		rendered.find('.history-branch').get(0)
		rendered.find('.history-branch').simulate('click')
		expect(clickedId).toEqual('5')
	})

	it('will not throw an error when an branch is clicked without an onClick handler defined', () => {
		const rendered = mount(
			<BranchList
				activeBranch="5"
				branches={[
					{
						id: '5',
						label: 'delta-1',
						startsAt: 5,
						endsAt: 10,
						maxDepth: 10,
						branchType: BranchType.CURRENT,
					},
				]}
			/>,
		)
		// click should be ok
		expect(rendered).toBeDefined()
		rendered.find('.history-branch').get(0)
		rendered.find('.history-branch').simulate('click')
	})
})
