import * as classnames from 'classnames'

import * as React from 'react'
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import colors from '../../palette'
import Continuation from '../Continuation'
import { StateProps } from './interfaces'
import './State.scss'

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

function getBackgroundColor(branchType, active) {
	let result = null
	result = coloring[branchType][active ? 'active' : 'nonactive']
	return result
}

function continuationColor(isActive, isPinned) {
	let result = colors.CONT_BLANK
	if (isPinned) {
		result = colors.CONT_PINNED
	} else if (isActive) {
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
		branchType: 'current',
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
			<div
				style={{
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Continuation
					count={numChildren}
					color={continuationColor(active, pinned)}
					onClick={e => handleContinuationClick(e)}
				/>
			</div>
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
			<div
				className={classnames('history-state', { successor })}
				style={{
					...this.props.style,
					backgroundColor,
				}}
				onClick={e => handleClick(e)}
			>
				<ReactCSSTransitionGroup
					transitionName="continuation-dissolve"
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}
				>
					{continuation}
				</ReactCSSTransitionGroup>
				<div className="state-detail">
					<div className={classnames('state-source', { active })}>
						{source || ''}
					</div>
					<div className={classnames('state-name', { active })}>
						{label || ''}
					</div>
				</div>
				{bookmark}
			</div>
		)
	}
}
