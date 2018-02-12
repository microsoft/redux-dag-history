import * as React from 'react'

const LeftIcon = require('react-icons/lib/md/keyboard-arrow-left')
const RightIcon = require('react-icons/lib/md/keyboard-arrow-right')
const UpIcon = require('react-icons/lib/fa/caret-up')
const DownIcon = require('react-icons/lib/fa/caret-down')
const PlayIcon = require('react-icons/lib/md/play-arrow')
const StopIcon = require('react-icons/lib/md/stop')

export interface ButtonProps {
	onClick: () => void
	size: number
}

export const StepBack: React.StatelessComponent<ButtonProps> = ({
	onClick,
	size,
}) => <LeftIcon size={size} onClick={onClick} />

export const StepForward: React.StatelessComponent<ButtonProps> = ({
	onClick,
	size,
}) => <RightIcon size={size} onClick={onClick} />

export const JumpBack: React.StatelessComponent<ButtonProps> = ({
	onClick,
	size,
}) => <UpIcon size={size} onClick={onClick} />

export const JumpForward: React.StatelessComponent<ButtonProps> = ({
	onClick,
	size,
}) => <DownIcon size={size} onClick={onClick} />

export interface PlayPauseProps {
	size: number
	show: boolean
	playing: boolean
	onStop: () => void
	onPlay: () => void
}

export const PlayPause: React.StatelessComponent<PlayPauseProps> = ({
	size,
	onStop,
	onPlay,
	show,
	playing,
}) => {
	if (!show) {
		return <div />
	}
	return playing ? (
		<StopIcon size={size} onClick={onStop} />
	) : (
		<PlayIcon size={size} onClick={onPlay} />
	)
}
