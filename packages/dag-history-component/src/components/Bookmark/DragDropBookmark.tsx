import * as React from 'react'
import { Dispatch } from 'redux'
import EditableBookmark, { EditableBookmarkProps } from './EditableBookmark'
import { Dragged, DragDropWrapper } from './styled'
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
			return <Dragged />
		} else {
			return (
				<DragDropWrapper>
					<EditableBookmark {...this.props} />
				</DragDropWrapper>
			)
		}
	}
}
