import * as React from 'react'
import { Container } from './styled'

function getContinuationText(count: number) {
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

function handleClick(handler: Function) {
	if (handler) {
		return (evt: React.MouseEvent<any>) => {
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
	color: backgroundColor,
	onClick,
}) => {
	const continuationText = getContinuationText(count)
	return (
		<Container style={{ backgroundColor }} onClick={handleClick(onClick)}>
			{continuationText}
		</Container>
	)
}

export default Continuation
