import * as classnames from 'classnames'
import * as React from 'react'
import DiscoveryTrail from '../DiscoveryTrail'
import {
	Container,
	DetailsContainer,
	Details,
	Title,
	Annotation,
} from './styled'

export interface BookmarkProps {
	name: string
	index: number
	active?: boolean
	numLeadInStates?: number
	onClick?: () => void
	onClickEdit?: () => void
	annotation: string
	commitPathLength: number
	onDiscoveryTrailIndexClicked?: (index: number) => void
}

function determineHighlight(props: BookmarkProps): number {
	/*
	TODO: Props here were wrong - fix highlight
	const { selectedDepth } = props
	if (selectedDepth === undefined && props.active) {
		return Math.max(0, (props.shortestCommitPath || []).length - 1)
	}
	return selectedDepth
	*/
	return 0
}

const Bookmark: React.StatelessComponent<BookmarkProps> = (
	props: BookmarkProps,
) => {
	const {
		name,
		index,
		active,
		onClick,
		onClickEdit,
		onDiscoveryTrailIndexClicked,
		numLeadInStates,
		annotation,
		commitPathLength,
	} = props
	const highlight = determineHighlight(props)
	const isDiscoveryTrailVisible = active && numLeadInStates > 0
	const discoveryTrail = isDiscoveryTrailVisible ? (
		<DiscoveryTrail
			fullWidth={true}
			depth={commitPathLength - 1}
			highlight={highlight}
			leadIn={numLeadInStates}
			active={active}
			onIndexClicked={(idx: number) => onDiscoveryTrailIndexClicked(idx)}
		/>
	) : null
	return (
		<Container className={classnames({ active })}>
			<DetailsContainer>
				<Details onClick={onClick ? () => onClick() : undefined}>
					<Title
						className={classnames({ active })}
						onClick={() => onClickEdit()}
					>
						{name}
					</Title>
					<Annotation onClick={() => onClickEdit()}>{annotation}</Annotation>
				</Details>
				{discoveryTrail}
			</DetailsContainer>
		</Container>
	)
}

export default Bookmark
