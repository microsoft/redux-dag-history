import { mount } from 'enzyme'
import * as React from 'react'
import Branch from '../../../src/components/Branch'

describe('The Branch component', () => {
	it('can be rendered', () => {
		const rendered = mount(
			<Branch
				label="A Test Branch"
				branchType="current"
				startsAt={0}
				endsAt={10}
				maxDepth={15}
			/>,
		)
		expect(rendered).to.be.ok
		rendered.simulate('click') // no error
	})

	it('can respond to click events rendered', () => {
		let clicked = false
		const rendered = mount(
			<Branch
				label="A Test Branch"
				branchType="current"
				startsAt={0}
				endsAt={10}
				maxDepth={15}
				onClick={() => (clicked = true)}
			/>,
		)
		rendered.simulate('click')
		expect(clicked).to.be.true
	})
})
