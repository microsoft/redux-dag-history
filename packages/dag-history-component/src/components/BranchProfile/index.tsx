import * as React from 'react'
import colors from '../../palette'
import './BranchProfile.scss'
import calculateSpans from './calculateSpans'

const { PropTypes } = React

/**
 * Gets styling for the branch-info spans
 */
function infoSpanStyle(flex, backgroundColor) {
	if (flex === 0) {
		return { display: 'none' }
	}
	return { backgroundColor, flex }
}

export interface IBranchProfileProps {
	start: number
	end: number
	branchStart?: number
	branchEnd?: number
	max: number
	activeStateIndex?: number
	type: 'current' | 'legacy'
}

const BranchProfile: React.StatelessComponent<IBranchProfileProps> = ({
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
		.map(s => infoSpanStyle(s.length, colors[s.type]))
		.map((style, index) => <div key={`branchinfo:${index}`} style={style} />)

	return <div className="history-branch-profile">{spanComponents}</div>
}

BranchProfile.propTypes = {
	start: PropTypes.number.isRequired,
	end: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	branchStart: PropTypes.number,
	branchEnd: PropTypes.number,
	activeStateIndex: PropTypes.number,
	type: PropTypes.oneOf(['current', 'legacy']).isRequired,
}

export default BranchProfile
