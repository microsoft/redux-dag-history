import * as classnames from 'classnames'
import { debounce } from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import * as state from '../../state'
import {
	DragSource,
	DropTarget,
	DragSourceMonitor,
	DropTargetMonitor,
	DragSourceCollector,
	DropTargetCollector,
} from 'react-dnd'
import {
	bookmarkDragCancel,
	bookmarkDragDrop,
	bookmarkDragHover,
	bookmarkDragStart,
} from '../../state/actions/creators'
import {
	default as DragDropBookmark,
	DragDropBookmarkProps,
} from './DragDropBookmark'

const flow = require('lodash/flow')

const dragSource = {
	beginDrag(props: DragDropBookmarkProps) {
		const { index, dispatch, stateId } = props
		dispatch(bookmarkDragStart({ index, key: stateId }))
		return { index }
	},
	endDrag(props: DragDropBookmarkProps, monitor: DragSourceMonitor) {
		const { dispatch, hoverIndex, dragIndex } = props
		const item = monitor.getItem() as any
		const droppedOn = hoverIndex < dragIndex ? hoverIndex : hoverIndex - 1
		dispatch(bookmarkDragDrop({
			index: item.index,
			droppedOn,
		}) as any)
	},
}

const fireHoverEvent = debounce((dispatch, index) =>
	dispatch(bookmarkDragHover({ index })),
)

const dropTargetSpec = {
	drop(props: DragDropBookmarkProps, monitor: DragSourceMonitor) {
		const { index } = props
		return { index }
	},
	hover(
		props: DragDropBookmarkProps,
		monitor: DropTargetMonitor,
		component: React.ReactInstance,
	) {
		if (!monitor.isOver()) {
			return
		}
		const { dispatch, index, hoverIndex, dragIndex, dragKey, stateId } = props

		if (dragKey === stateId) {
			return
		}
		const domNode = ReactDOM.findDOMNode(component)
		const { clientWidth: width, clientHeight: height } = domNode
		const rect = domNode.getBoundingClientRect()
		const clientY = monitor.getClientOffset().y
		const midline = rect.top + (rect.bottom - rect.top) / 2
		const newHoverIndex = clientY < midline ? index : index + 1

		if (newHoverIndex !== hoverIndex) {
			fireHoverEvent(dispatch, newHoverIndex)
		}
	},
}

const connectDragSource: DragSourceCollector = (c, monitor) => ({
	connectDragSource: c.dragSource(),
	isDragging: monitor.isDragging(),
})

const connectDropTarget: DropTargetCollector = (c, monitor) => ({
	connectDropTarget: c.dropTarget(),
})

export default flow(
	DragSource('BOOKMARK', dragSource, connectDragSource),
	DropTarget('BOOKMARK', dropTargetSpec as any, connectDropTarget),
	connect(),
)(DragDropBookmark)
