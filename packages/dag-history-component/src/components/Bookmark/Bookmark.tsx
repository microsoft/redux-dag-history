import * as classnames from 'classnames'

import * as React from 'react'
import DiscoveryTrail from '../DiscoveryTrail'
import './Bookmark.scss'

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

const determineHighlight = props => {
	const { selectedDepth } = props
	if (selectedDepth === undefined && props.active) {
		return Math.max(0, (props.shortestCommitPath || []).length - 1)
	}
	return selectedDepth
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
			onIndexClicked={idx => onDiscoveryTrailIndexClicked(idx)}
		/>
	) : null
	return (
		<div className={`history-bookmark ${active ? 'selected' : ''}`}>
			<div className="bookmark-details-container">
				<div
					className="bookmark-details"
					onClick={onClick ? () => onClick() : undefined}
				>
					<div
						className={classnames('bookmark-title', { active })}
						onClick={() => onClickEdit()}
					>
						{name}
					</div>
					<div className="bookmark-annotation" onClick={() => onClickEdit()}>
						{annotation}
					</div>
				</div>
				{discoveryTrail}
			</div>
		</div>
	)
}

export default Bookmark
