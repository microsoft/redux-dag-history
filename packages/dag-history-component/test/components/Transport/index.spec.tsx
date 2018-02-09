import * as Promise from 'bluebird'
import { mount, configure } from 'enzyme'
import * as React from 'react'
import Transport from '../../../src/components/Transport'
import * as Adapter from 'enzyme-adapter-react-16'
import { PlayPause, StepBack } from '../../../src/components/Transport/buttons'
const CLICK_DELAY = 55

configure({ adapter: new Adapter() })

describe('The Transport Component', () => {
	it('can render', () => {
		const rendered = mount(<Transport />)
		expect(rendered).toBeDefined()
	})

	it('can handle play invocations', () => {
		let rendered = mount(<Transport playing={true} />)
		console.log(rendered.html())
		rendered.find(PlayPause).simulate('click')

		let fired = false
		rendered = mount(<Transport onPlay={() => (fired = true)} />)
		;(rendered.get(0) as any).play()
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).toBeTruthy()
				fired = false
				rendered.find(PlayPause).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).toBeTruthy())
	})

	it('can handle stop invocations', () => {
		let rendered = mount(<Transport playing={true} />)
		rendered.find(PlayPause).simulate('click')

		let fired = false
		rendered = mount(<Transport playing={true} onStop={() => (fired = true)} />)
		rendered.find(PlayPause).simulate('click')
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).toBeTruthy()
				fired = false
				rendered.find(PlayPause).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).toBeTruthy())
	})

	it('can handle back invocations', () => {
		let rendered = mount(<Transport />)
		rendered.find(StepBack).simulate('click')

		let fired = false
		rendered = mount(<Transport onStepBack={() => (fired = true)} />)
		rendered.find(StepBack).simulate('click')
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).toBeTruthy()
				fired = false
				rendered.find(StepBack).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).toBeTruthy())
	})

	it('can handle forward invocations', () => {
		let rendered = mount(<Transport />)
		;(rendered.get(0) as any).stepForward()

		let fired = false
		rendered = mount(<Transport onStepForward={() => (fired = true)} />)
		;(rendered.get(0) as any).stepForward()
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).toBeTruthy()
				fired = false
				rendered.find(StepBack).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).toBeTruthy())
	})
})
