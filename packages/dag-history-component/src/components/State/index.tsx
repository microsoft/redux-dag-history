import * as classnames from 'classnames'
import * as React from 'react'
import Transition from 'react-transition-group/Transition'
import colors from '../../palette'
import Continuation from '../Continuation'
import { StateProps } from './interfaces'
import { BranchType } from '../../interfaces'
import {
	Container,
	Detail,
	Source,
	Name,
	ContinuationContainer,
} from './styled'

const Bookmark = require('react-icons/lib/io/bookmark')

const coloring = {
	current: {
		active: colors.CURRENT_ACTIVE,
		nonactive: colors.CURRENT,
	},
	legacy: {
		active: colors.LEGACY_ACTIVE,
		nonactive: colors.ANCESTOR,
	},
	unrelated: {
		active: colors.UNRELATED,
		nonactive: colors.UNRELATED_UNIQUE,
	},
}

function getBackgroundColor(branchType: BranchType, active: boolean) {
	return coloring[branchType.toString()][active ? 'active' : 'nonactive']
}

function continuationColor(active: boolean, pinned: boolean) {
	let result = colors.CONT_BLANK
	if (pinned) {
		result = colors.CONT_PINNED
	} else if (active) {
		result = colors.CONT_ACTIVE
	}
	return result
}

export default class State extends React.PureComponent<StateProps> {
	public static defaultProps = {
		id: undefined,
		source: undefined,
		showContinuation: true,
		label: '',
		branchType: BranchType.CURRENT,
		numChildren: 0,
	}

	public render() {
		const {
			id,
			source,
			label,
			branchType,
			active,
			renderBookmarks,
			bookmarked,
			numChildren,
			onClick,
			onContinuationClick,
			onBookmarkClick,
			successor,
			pinned,
			showContinuation,
		} = this.props
		const backgroundColor = getBackgroundColor(branchType, active)

		const handleClick = e => {
			if (onClick) {
				onClick(id)
			}
		}

		const handleContinuationClick = e => {
			if (onContinuationClick) {
				onContinuationClick(id)
			}
		}

		const handleBookmarkClick = e => {
			if (onBookmarkClick) {
				onBookmarkClick(id)
			}
		}

		const continuation = showContinuation ? (
			<ContinuationContainer>
				<Continuation
					count={numChildren}
					color={continuationColor(active, pinned)}
					onClick={e => handleContinuationClick(e)}
				/>
			</ContinuationContainer>
		) : null

		const bookmark = renderBookmarks ? (
			<Bookmark
				size={25}
				color={bookmarked ? 'gold' : 'white'}
				onClick={e => handleBookmarkClick(e)}
			/>
		) : null

		const marginLeftValue = successor ? 30 : 0

		return (
			<Container
				className={classnames({ successor })}
				style={{
					...this.props.style,
					backgroundColor,
				}}
				onClick={e => handleClick(e)}
			>
				<Transition
					transitionName="continuation-dissolve"
					timeout={250}
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}
				>
					{continuation}
				</Transition>
				<Detail>
					<Source className={classnames({ active })}>{source || ''}</Source>
					<Name className={classnames({ active })}>{label || ''}</Name>
				</Detail>
				{bookmark}
			</Container>
		)
	}
}
