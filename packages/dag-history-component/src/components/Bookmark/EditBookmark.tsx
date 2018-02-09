import * as debug from 'debug'
import { StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as classnames from 'classnames'
import * as React from 'react'
import DiscoveryTrail from '../DiscoveryTrail'
import {
	Container,
	ControlsContainer,
	DetailsEditable,
	DiscoveryTrailLabel,
	DiscoveryTrailInfoButton,
	EditableTitleContainer,
	EditAnnotation,
	Title,
} from './styled'
const CloseIcon = require('react-icons/lib/fa/caret-down')
const log = debug('dag-history-component:components:Bookmark')

export interface EditBookmarkProps {
	name: string
	annotation: string
	index: number
	numLeadInStates?: number
	active?: boolean
	onClick?: Function
	onBookmarkChange?: Function
	onDoneEditing?: Function
	shortestCommitPath?: StateId[]
	selectedDepth?: number
	onDiscoveryTrailIndexClicked?: (index: number) => void
	onSelectBookmarkDepth?: Function

	// Injected by React DnD
	isDragging?: boolean
}

export default class EditBookmark extends React.Component<EditBookmarkProps> {
	private annotationComponent?: HTMLTextAreaElement
	private leadInComponent: HTMLSelectElement

	public componentDidMount() {
		this.annotationComponent.focus()
	}

	private onDone() {
		const { onDoneEditing } = this.props
		onDoneEditing()
	}

	private setAnnotationComponent(c: HTMLTextAreaElement) {
		this.annotationComponent = c
	}

	private setLeadInComponent(c: HTMLSelectElement) {
		this.leadInComponent = c
	}

	private onDoneEditing() {
		const {
			annotation: existingAnnotation,
			numLeadInStates: existingNumLeadInStates,
			onBookmarkChange,
		} = this.props

		const annotation = this.annotationComponent.value
		const isBookmarkUpdated = annotation !== existingAnnotation

		if (isBookmarkUpdated && onBookmarkChange) {
			onBookmarkChange({
				name: this.props.name,
				data: {
					annotation,
					numLeadInStates: existingNumLeadInStates,
				},
			})
		}
	}

	private onLeadInSet(value?: number) {
		const {
			annotation: existingAnnotation,
			numLeadInStates: existingNumLeadInStates,
			onBookmarkChange,
		} = this.props

		const annotation = this.annotationComponent.value
		const isBookmarkUpdated =
			value !== existingNumLeadInStates || annotation !== existingAnnotation

		if (isBookmarkUpdated && onBookmarkChange) {
			onBookmarkChange({
				name: this.props.name,
				data: {
					annotation,
					numLeadInStates: value,
				},
			})
		}
	}

	private onClick() {
		const {
			selectedDepth: depth,
			index: bookmarkIndex,
			onSelectBookmarkDepth,
			shortestCommitPath,
		} = this.props
		if (onSelectBookmarkDepth) {
			const state = shortestCommitPath[depth || shortestCommitPath.length - 1]
			onSelectBookmarkDepth({ bookmarkIndex, depth, state })
		}
	}

	public render() {
		const {
			name,
			index,
			annotation,
			active,
			onClick,
			shortestCommitPath,
			selectedDepth,
			numLeadInStates,
			onDiscoveryTrailIndexClicked,
		} = this.props

		const commitPathLength = shortestCommitPath.length
		const leadInStatesValue =
			numLeadInStates !== undefined ? `${numLeadInStates}` : 'all'
		const isIntroSet = numLeadInStates !== undefined

		log(
			'rendering commitPathLength=%s, selectedDepth=%s',
			commitPathLength,
			selectedDepth,
		)
		return (
			<Container className={classnames({ active })} data-index={index}>
				<DetailsEditable>
					<EditableTitleContainer onClick={() => this.onClick()}>
						<Title className={classnames({ active })} tabIndex={0}>
							{name}
						</Title>
						<CloseIcon tabIndex={1} onClick={() => this.onDone()} />
					</EditableTitleContainer>
					<EditAnnotation
						tabIndex={2}
						innerRef={c => this.setAnnotationComponent(c)}
						name="bookmarkAnnotation"
						cols={40}
						rows={5}
						placeholder="Enter caption for presentation"
						defaultValue={annotation}
						onBlur={() => this.onDoneEditing()}
					/>
					<div>
						<ControlsContainer onClick={() => this.onClick()}>
							<DiscoveryTrailLabel>Discovery trail</DiscoveryTrailLabel>
							<DiscoveryTrailInfoButton
								tabIndex={3}
								onClick={e =>
									this.onLeadInSet(commitPathLength - selectedDepth - 1)
								}
							>
								Set intro
							</DiscoveryTrailInfoButton>
						</ControlsContainer>
						<DiscoveryTrail
							depth={commitPathLength - 1}
							highlight={selectedDepth}
							leadIn={numLeadInStates}
							active={active}
							onIndexClicked={(idx: number) =>
								onDiscoveryTrailIndexClicked(idx)
							}
						/>
					</div>
				</DetailsEditable>
			</Container>
		)
	}
}
