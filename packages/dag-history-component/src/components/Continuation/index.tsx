
import * as React from 'react'
import './Continuation.scss'

function getContinuationText(count) {
	const sanecount = Math.abs(count || 0)
	let result
	if (sanecount <= 1) {
		result = ''
	} else if (sanecount < 99) {
		result = `${sanecount}`
	} else {
		result = '99+'
	}
	return result
}

function handleClick(handler) {
	if (handler) {
		return evt => {
			handler(evt)
			evt.stopPropagation()
		}
	}
}

export interface ContinuationProps {
	count?: number
	color?: string
	onClick?: Function
}

const Continuation: React.StatelessComponent<ContinuationProps> = ({
	count,
	color,
	onClick,
}) => {
	const continuationText = getContinuationText(count)
	return (
		<div
			className="history-state-continuations"
			style={{ backgroundColor: color }}
			onClick={handleClick(onClick)}
		>
			{continuationText}
		</div>
	)
}

export default Continuation
