import { BranchId } from '@essex/redux-dag-history/lib/interfaces'

import * as React from 'react'
import Branch, { BranchProps } from '../Branch'
import './BranchList.scss'

export interface BranchListProps {
	activeBranch?: BranchId
	branches: BranchProps[]
	onBranchClick?: (branchId: BranchId) => void
	style?: any
}

const BranchList: React.StatelessComponent<BranchListProps> = ({
	activeBranch,
	branches,
	onBranchClick,
	style,
}) => {
	const branchViews = branches.map(s => (
		<Branch
			{...s}
			key={`branch:${s.id}`}
			onClick={() => (onBranchClick ? onBranchClick(s.id) : undefined)}
			active={activeBranch === s.id}
		/>
	))
	return (
		<div className="history-branch-list" style={{ ...style }}>
			<div className="history-branch-list-inner">{branchViews}</div>
		</div>
	)
}

export default BranchList
