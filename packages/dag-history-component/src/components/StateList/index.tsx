import { StateId } from '@essex/redux-dag-history'
import * as React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import isNumber from '../../util/isNumber'
import State from '../State'
import { StateProps } from '../State/interfaces'
import { Container } from './styled'

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

		const handleClick = (id: StateId) => {
			if (onStateClick) {
				onStateClick(id)
			}
		}

		const handleContinuationClick = (id: StateId) => {
			if (onStateContinuationClick) {
				onStateContinuationClick(id)
			}
		}

		const handleBookmarkClick = (id: StateId) => {
			if (onStateBookmarkClick) {
				onStateBookmarkClick(id)
			}
		}

		const stateViews = states.map((s, index) => (
			<CSSTransition
				key={s.id}
				classNames="state-entry"
				timeout={{ enter: 250, exit: 250 }}
			>
				<State
					{...s}
					{...{ renderBookmarks }}
					onClick={id => handleClick(id)}
					onContinuationClick={id => handleContinuationClick(id)}
					onBookmarkClick={id => handleBookmarkClick(id)}
				/>
			</CSSTransition>
		))
		return (
			<Container innerRef={(e: HTMLDivElement) => (this.containerDiv = e)}>
				<TransitionGroup>{stateViews}</TransitionGroup>
			</Container>
		)
	}
}
