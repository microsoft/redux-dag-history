import { BranchId } from '@essex/redux-dag-history/lib/interfaces'
import * as React from 'react'
import Branch, { BranchProps } from '../Branch'
import { Container, Branches } from './styled'

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
		<Container style={style}>
			<Branches>{branchViews}</Branches>
		</Container>
	)
}

export default BranchList
