import * as React from 'react'
import { Container } from './styled'
const debounce = require('lodash/debounce')
const LeftIcon = require('react-icons/lib/md/keyboard-arrow-left')
const RightIcon = require('react-icons/lib/md/keyboard-arrow-right')
const UpIcon = require('react-icons/lib/fa/caret-up')
const DownIcon = require('react-icons/lib/fa/caret-down')
const PlayIcon = require('react-icons/lib/md/play-arrow')
const StopIcon = require('react-icons/lib/md/stop')

const DEFAULT_ICON_SIZE = 30

export interface TransportCallbackProps {
	onPlay?: Function
	onStop?: Function
	onBack?: Function
	onForward?: Function
	onStepForward?: Function
	onStepBack?: Function
}

export interface TransportProps extends TransportCallbackProps {
	iconSize?: number
	playing?: boolean
	showPlay?: boolean

	/**
	 * When this is true, then stepping downwards means stepping into older states
	 */
	reverseVertical?: boolean
}

const keys = {
	SPACE: 32,
	ESC: 27,
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
}

class Transport extends React.Component<TransportProps> {
	public static defaultProps = {
		iconSize: DEFAULT_ICON_SIZE,
		playing: false,
		showPlay: true,
	}

	private handlers: TransportCallbackProps = null

	public play() {
		if (this.handlers.onPlay) {
			this.handlers.onPlay()
		}
	}

	public stepBack() {
		if (this.handlers.onStepBack) {
			this.handlers.onStepBack()
		}
	}

	public stepForward() {
		if (this.handlers.onStepForward) {
			this.handlers.onStepForward()
		}
	}

	public stop() {
		if (this.handlers.onStop) {
			this.handlers.onStop()
		}
	}

	public back() {
		if (this.props.reverseVertical) {
			this.goForward()
		} else {
			this.goBack()
		}
	}

	public forward() {
		if (this.props.reverseVertical) {
			this.goBack()
		} else {
			this.goForward()
		}
	}

	private goBack() {
		if (this.handlers.onBack) {
			this.handlers.onBack()
		}
	}

	private goForward() {
		if (this.handlers.onForward) {
			this.handlers.onForward()
		}
	}

	public render() {
		const { iconSize, playing, showPlay } = this.props

		this.handlers = {
			onPlay: this.props.onPlay,
			onStop: this.props.onStop,
			onBack: this.props.onBack,
			onForward: this.props.onForward,
			onStepForward: this.props.onStepForward,
			onStepBack: this.props.onStepBack,
		}

		let playPauseButton = <div />
		if (showPlay) {
			playPauseButton = playing ? (
				<StopIcon size={iconSize} onClick={() => this.stop()} />
			) : (
				<PlayIcon size={iconSize} onClick={() => this.play()} />
			)
		}

		return (
			<Container
				tabIndex={0}
				onKeyPress={() => undefined} // allows event bubbling
			>
				<div>
					<LeftIcon size={iconSize} onClick={() => this.stepBack()} />
					<RightIcon size={iconSize} onClick={() => this.stepForward()} />
				</div>
				{playPauseButton}
				<div>
					<UpIcon size={iconSize} onClick={() => this.back()} />
					<DownIcon size={iconSize} onClick={() => this.forward()} />
				</div>
			</Container>
		)
	}
}
export default Transport
