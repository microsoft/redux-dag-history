import { mount, configure } from 'enzyme'
import * as React from 'react'
import Continuation from '../../../src/components/Continuation'
import * as Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('The Continuation component', () => {
	it('can be rendered', () => {
		const rendered = mount(<Continuation />)
		expect(rendered).toBeDefined()
	})

	it('can render a sane continuation count', () => {
		const rendered = mount(<Continuation count={10} />)
		expect(rendered).toBeDefined()
		const found = rendered.find(Continuation)
		expect(found.html().indexOf('10')).toBeGreaterThanOrEqual(0)
		expect(found.length).toEqual(1)
	})

	it('can render a high count', () => {
		const rendered = mount(<Continuation count={1000} />)
		expect(rendered).toBeDefined()
		const found = rendered.find(Continuation)
		expect(found.html().indexOf('99+')).toBeGreaterThanOrEqual(0)
		expect(found.length).toEqual(1)
	})

	it('can be rendered', () => {
		let clicked = false
		const rendered = mount(<Continuation onClick={() => (clicked = true)} />)
		rendered.simulate('click')
		expect(clicked).toBeTruthy()
	})
})
