import { mount, configure } from 'enzyme'
import * as React from 'react'
import OptionDropdown from '../../../src/components/OptionDropdown'
import * as Adapter from 'enzyme-adapter-react-16'

const {
	default: Dropdown,
	DropdownTrigger,
	DropdownContent,
} = require('react-simple-dropdown')

configure({ adapter: new Adapter() })

describe('The OptionDropdown Component', () => {
	it('can be rendered', () => {
		let rendered = mount(<OptionDropdown />)
		expect(rendered).toBeDefined()

		rendered = mount(<OptionDropdown label="TestOptions" />)
		expect(rendered).toBeDefined()
	})

	it('can handle on option being clicked', () => {
		let clicked = null
		const rendered = mount(
			<OptionDropdown
				options={[
					{ label: 'Derp', onClick: () => (clicked = 'derp') },
					{ onClick: () => (clicked = 'herp') },
					{ element: <h3>hi</h3>, onClick: () => (clicked = 'flerp') },
				]}
			/>,
		)

		rendered
			.find(OptionDropdown)
			.at(0)
			.simulate('click')

		expect(rendered).toBeDefined()
		rendered
			.find('li')
			.at(0)
			.simulate('click')
		expect(clicked).toEqual('derp')

		rendered
			.find('li')
			.at(1)
			.simulate('click')
		expect(clicked).toEqual('herp')

		rendered
			.find('li')
			.at(2)
			.simulate('click')
		expect(clicked).toEqual('flerp')
	})
})
