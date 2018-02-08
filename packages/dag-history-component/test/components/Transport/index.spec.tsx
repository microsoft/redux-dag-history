import * as Promise from 'bluebird'
import { mount } from 'enzyme'
import * as React from 'react'
import * as TestUtils from 'react-addons-test-utils'
import Transport from '../../../src/components/Transport'

const MdKeyboardArrowLeft = require('react-icons/lib/md/keyboard-arrow-left')
const MdKeyboardArrowRight = require('react-icons/lib/md/keyboard-arrow-right')
const MdSkipNext = require('react-icons/lib/md/skip-next')
const MdSkipPrevious = require('react-icons/lib/md/skip-previous')
const MdPlayArrow = require('react-icons/lib/md/play-arrow')
const MdStop = require('react-icons/lib/md/stop')

const CLICK_DELAY = 55

describe('The Transport Component', () => {
	it('can render', () => {
		const rendered = mount(<Transport />)
		expect(rendered).to.be.ok
	})

	it('can handle play invocations', () => {
		let rendered = mount(<Transport playing />)
		;(rendered.get(0) as any).play()

		let fired = false
		rendered = mount(<Transport onPlay={() => (fired = true)} />)
		;(rendered.get(0) as any).play()
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).to.be.true
				fired = false
				rendered.find(MdPlayArrow).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).to.be.true)
	})

	it('can handle stop invocations', () => {
		let rendered = mount(<Transport playing />)
		;(rendered.get(0) as any).stop()

		let fired = false
		rendered = mount(<Transport playing onStop={() => (fired = true)} />)
		;(rendered.get(0) as any).stop()
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).to.be.true
				fired = false
				rendered.find(MdStop).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).to.be.true)
	})

	it('can handle back invocations', () => {
		let rendered = mount(<Transport />)
		;(rendered.get(0) as any).stepBack()

		let fired = false
		rendered = mount(<Transport onStepBack={() => (fired = true)} />)
		;(rendered.get(0) as any).stepBack()
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).to.be.true
				fired = false
				rendered.find(MdKeyboardArrowLeft).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).to.be.true)
	})

	it('can handle forward invocations', () => {
		let rendered = mount(<Transport />)
		;(rendered.get(0) as any).stepForward()

		let fired = false
		rendered = mount(<Transport onStepForward={() => (fired = true)} />)
		;(rendered.get(0) as any).stepForward()
		return Promise.delay(CLICK_DELAY)
			.then(() => {
				expect(fired).to.be.true
				fired = false
				rendered.find(MdKeyboardArrowRight).simulate('click')
				return Promise.delay(CLICK_DELAY)
			})
			.then(() => expect(fired).to.be.true)
	})
})
