import { BranchId } from '@essex/redux-dag-history/lib/interfaces'
import * as classnames from 'classnames'
import { BranchType } from '../../interfaces'
import * as React from 'react'
import BranchProfile from '../BranchProfile'
import './Branch.scss'

export interface BranchProps {
	id?: BranchId
	label: string
	branchType: BranchType
	startsAt: number
	endsAt: number
	currentBranchStart?: number
	currentBranchEnd?: number
	maxDepth: number
	activeStateIndex?: number
	onClick?: React.EventHandler<React.MouseEvent<any>>
	active?: boolean
}

const Branch: React.StatelessComponent<BranchProps> = ({
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

export default Branch
