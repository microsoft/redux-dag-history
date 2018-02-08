import * as React from 'react'
import colors from '../../palette'
import calculateSpans from './calculateSpans'
import { Container } from './styled'
import { BranchType } from '../../interfaces'
/**
 * Gets styling for the branch-info spans
 */
function infoSpanStyle(flex: number, backgroundColor: string) {
	if (flex === 0) {
		return { display: 'none' }
	}
	return { backgroundColor, flex }
}

export interface BranchProfileProps {
	start: number
	end: number
	branchStart?: number
	branchEnd?: number
	max: number
	activeStateIndex?: number
	type: BranchType
}

const BranchProfile: React.StatelessComponent<BranchProfileProps> = ({
	type,
	start,
	end,
	max,
	branchStart,
	branchEnd,
	activeStateIndex: activeIndex,
}) => {
	const infoSpans = calculateSpans(
		type,
		max,
		start,
		end,
		branchStart,
		branchEnd,
		activeIndex,
	)
	const spanComponents = infoSpans
		.map(s => infoSpanStyle(s.length, colors[s.type.toString()]))
		.map((style, index) => <div key={`branchinfo:${index}`} style={style} />)

	return <Container>{spanComponents}</Container>
}

export default BranchProfile
