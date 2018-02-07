import * as React from 'react'
import './Continuation.scss'

const { PropTypes } = React

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

export interface IContinuationProps {
	count?: number
	color?: string
	onClick?: Function
}

const Continuation: React.StatelessComponent<IContinuationProps> = ({
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

Continuation.propTypes = {
	count: PropTypes.number,
	color: PropTypes.string,
	onClick: PropTypes.func,
}

export default Continuation
