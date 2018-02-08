import { BranchId } from '@essex/redux-dag-history/lib/interfaces'
import * as classnames from 'classnames'
import { BranchType } from '../../interfaces'
import * as React from 'react'
import BranchProfile from '../BranchProfile'
import { Container, Details, Name, ProfileContainer } from './styled'

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
	<Container onClick={e => (onClick ? onClick(e) : undefined)}>
		<ProfileContainer>
			<BranchProfile
				start={startsAt}
				end={endsAt}
				max={maxDepth}
				branchStart={currentBranchStart}
				branchEnd={currentBranchEnd}
				type={branchType}
				activeStateIndex={activeStateIndex}
			/>
		</ProfileContainer>
		<Details>
			<Name className={classnames({ active })}>{label}</Name>
		</Details>
	</Container>
)

export default Branch
