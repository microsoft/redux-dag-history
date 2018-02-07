import * as React from 'react'
import { Dispatch } from 'redux'
import {
	default as EditableBookmark,
	EditableBookmarkProps,
} from './EditableBookmark'
const flow = require('lodash/flow')

export interface DragDropBookmarkProps extends EditableBookmarkProps {
	// Injected by React DnD:
	isDragging?: boolean
	connectDragSource?: () => void
	connectDropTarget?: () => void
	dragIndex?: number
	hoverIndex?: number
	dragKey?: string
	dispatch: Dispatch<any>
	stateId: string
}

export default class DrapDropBookmark extends React.Component<
	DragDropBookmarkProps
> {
	public render() {
		const { connectDragSource, connectDropTarget } = this.props
		return flow(connectDragSource, connectDropTarget)(this.renderBookmark())
	}

	private renderBookmark() {
		if (this.props.isDragging) {
			return <div className="bookmark-dragged" />
		} else {
			return (
				<div className="bookmark-dragdrop-wrapper">
					<EditableBookmark {...this.props} />
				</div>
			)
		}
	}
}
