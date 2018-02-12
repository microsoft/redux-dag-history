import * as debug from 'debug'
import * as React from 'react'
import { StateId } from '@essex/redux-dag-history'
import Bookmark from '../Bookmark'
import { Bookmarks, NoBookmarkText } from './styled'

const { DropTarget } = require('react-dnd')

const log = debug('@essex/redux-dag-history:BookmarkList')

export interface BookmarkListProps {
	bookmarks: any[]
	onBookmarkClick?: Function
	onSelectState?: Function
	onSelectBookmarkDepth?: Function
	bookmarkEditIndex?: number
	onBookmarkEdit: Function
	onBookmarkEditDone: Function

	dragIndex?: number
	hoverIndex?: number
	dragKey?: string
}

const NoBookmarks: React.StatelessComponent<{}> = () => (
	<NoBookmarkText>No Bookmarks</NoBookmarkText>
)

export default class BookmarkList extends React.PureComponent<
	BookmarkListProps,
	{}
> {
	public onBookmarkClick(index: number, stateId: StateId) {
		if (this.props.onBookmarkClick) {
			this.props.onBookmarkClick(index, stateId)
		}
	}

	public render() {
		const {
			bookmarks,
			onBookmarkClick,
			onSelectState,
			onSelectBookmarkDepth,
			dragIndex,
			hoverIndex,
			dragKey,
			onBookmarkEdit,
			onBookmarkEditDone,
			bookmarkEditIndex,
		} = this.props

		const bookmarkViews = bookmarks.map((s, index) => (
			<Bookmark
				{...s}
				editMode={index === bookmarkEditIndex}
				hoverIndex={hoverIndex}
				dragIndex={dragIndex}
				dragKey={dragKey}
				key={`bookmark::${s.stateId}`}
				index={index}
				onBookmarkEdit={onBookmarkEdit}
				onBookmarkEditDone={onBookmarkEditDone}
				stateId={s.stateId}
				onSelectBookmarkDepth={onSelectBookmarkDepth}
				onClick={() => this.onBookmarkClick(index, s.stateId)}
				onDiscoveryTrailIndexClicked={(selectedIndex: number) => {
					const target = s.shortestCommitPath[selectedIndex]
					onSelectBookmarkDepth({ target, depth: selectedIndex, state: target })
					onSelectState(target)
				}}
			/>
		))

		if (dragKey && hoverIndex >= 0 && hoverIndex !== dragIndex) {
			const dragged = bookmarkViews[dragIndex]
			const adjustedHoverIndex =
				hoverIndex < dragIndex ? hoverIndex : hoverIndex - 1
			bookmarkViews.splice(dragIndex, 1)
			bookmarkViews.splice(adjustedHoverIndex, 0, dragged)
		}
		return (
			<Bookmarks>
				{bookmarkViews.length > 0 ? bookmarkViews : <NoBookmarks />}
			</Bookmarks>
		)
	}
}
