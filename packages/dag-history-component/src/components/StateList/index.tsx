import { StateId } from '@essex/redux-dag-history/lib/interfaces'

import * as React from 'react'
import Transition from 'react-transition-group/Transition'
import isNumber from '../../util/isNumber'
import State from '../State'
import { StateProps } from '../State/interfaces'

export interface StateListProps {
	states: StateProps[]
	activeStateId?: StateId
	onStateClick?: Function
	onStateContinuationClick?: Function
	renderBookmarks?: boolean
	onStateBookmarkClick?: Function
}

export default class StateList extends React.Component<StateListProps> {
	private containerDiv: HTMLDivElement

	public componentDidUpdate() {
		this.containerDiv.scrollTop = this.containerDiv.scrollHeight
	}

	public render() {
		const {
			states,
			activeStateId,
			onStateClick,
			onStateContinuationClick,
			renderBookmarks,
			onStateBookmarkClick,
		} = this.props

		const handleClick = id => {
			if (onStateClick) {
				onStateClick(id)
			}
		}

		const handleContinuationClick = id => {
			if (onStateContinuationClick) {
				onStateContinuationClick(id)
			}
		}

		const handleBookmarkClick = id => {
			if (onStateBookmarkClick) {
				onStateBookmarkClick(id)
			}
		}

		const stateViews = states.map((s, index) => (
			<State
				{...s}
				{...{ renderBookmarks }}
				key={s.id}
				onClick={id => handleClick(id)}
				onContinuationClick={id => handleContinuationClick(id)}
				onBookmarkClick={id => handleBookmarkClick(id)}
			/>
		))
		return (
			<div ref={e => (this.containerDiv = e)} className="state-list-container">
				{/* TODO
				<Transition
					transitionName="state-entry"
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}
				>
				{stateViews}
				</Transition>
			*/}
				{stateViews}
			</div>
		)
	}
}
