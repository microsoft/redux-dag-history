import { BranchId } from '@essex/redux-dag-history/lib/interfaces'
import * as classnames from 'classnames'
import * as React from 'react'
import BranchProfile from '../BranchProfile'
import './Branch.scss'

export interface IBranchProps {
	id?: BranchId
	label: string
	branchType: 'current' | 'legacy'
	startsAt: number
	endsAt: number
	currentBranchStart?: number
	currentBranchEnd?: number
	maxDepth: number
	activeStateIndex?: number
	onClick?: React.EventHandler<React.MouseEvent<any>>
	active?: boolean
}

const Branch: React.StatelessComponent<IBranchProps> = ({
	label,
	branchType,
	startsAt,
	endsAt,
	currentBranchStart,
	currentBranchEnd,
	maxDepth,
	activeStateIndex,
	onClick,
	active,
}) => (
	<div
		className="history-branch"
		onClick={e => (onClick ? onClick(e) : undefined)}
	>
		<div className="history-branch-profile-container">
			<BranchProfile
				start={startsAt}
				end={endsAt}
				max={maxDepth}
				branchStart={currentBranchStart}
				branchEnd={currentBranchEnd}
				type={branchType}
				activeStateIndex={activeStateIndex}
			/>
		</div>
		<div className="branch-details">
			<div className={classnames('branch-name', { active })}>{label}</div>
		</div>
	</div>
)

Branch.propTypes = {
	id: React.PropTypes.string,
	label: React.PropTypes.string.isRequired,
	branchType: React.PropTypes.string.isRequired,
	startsAt: React.PropTypes.number.isRequired,
	endsAt: React.PropTypes.number.isRequired,
	currentBranchStart: React.PropTypes.number,
	currentBranchEnd: React.PropTypes.number,
	maxDepth: React.PropTypes.number.isRequired,
	activeStateIndex: React.PropTypes.number,
	onClick: React.PropTypes.func,
	active: React.PropTypes.bool,
	pinnedStateIndex: React.PropTypes.number,
}

export default Branch
