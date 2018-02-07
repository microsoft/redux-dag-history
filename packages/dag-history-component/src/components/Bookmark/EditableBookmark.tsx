import { StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as classnames from 'classnames'

import * as React from 'react'
import DiscoveryTrail from '../DiscoveryTrail'
import Bookmark, { BookmarkProps } from './Bookmark'
import './Bookmark.scss'
import EditBookmark from './EditBookmark'

export interface EditableBookmarkProps extends BookmarkProps {
	index: number
	numLeadInStates?: number
	onBookmarkChange?: Function
	onBookmarkEdit?: Function
	onBookmarkEditDone?: Function
	shortestCommitPath?: StateId[]
	selectedDepth?: number
	onSelectBookmarkDepth?: Function
	editMode: boolean
}

const EditableBookmark: React.StatelessComponent<
	EditableBookmarkProps
> = props => {
	const { editMode, onBookmarkEdit, onBookmarkEditDone } = props
	const innerBookmark = editMode ? (
		<EditBookmark {...props} onDoneEditing={onBookmarkEditDone} />
	) : (
		<Bookmark {...props} onClickEdit={() => onBookmarkEdit(props.index)} />
	)

	return <div>{innerBookmark}</div>
}
EditableBookmark.defaultProps = {
	index: null,
	editMode: false,
	name: '',
	annotation: '',
	commitPathLength: 0,
	shortestCommitPath: [],
}

export default EditableBookmark
