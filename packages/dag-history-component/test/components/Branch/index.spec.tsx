import { mount } from 'enzyme'
import * as React from 'react'
import Branch from '../../../src/components/Branch'
import { BranchType } from '../../../src/interfaces'

describe('The Branch component', () => {
	it('can be rendered', () => {
		const rendered = mount(
			<Branch
				label="A Test Branch"
				branchType={BranchType.CURRENT}
				startsAt={0}
				endsAt={10}
				maxDepth={15}
			/>,
		)
		expect(rendered).toBeDefined()
		rendered.simulate('click') // no error
	})

	it('can respond to click events rendered', () => {
		let clicked = false
		const rendered = mount(
			<Branch
				label="A Test Branch"
				branchType={BranchType.CURRENT}
				startsAt={0}
				endsAt={10}
				maxDepth={15}
				onClick={() => (clicked = true)}
			/>,
		)
		rendered.simulate('click')
		expect(clicked).toBeDefined()
	})
})
