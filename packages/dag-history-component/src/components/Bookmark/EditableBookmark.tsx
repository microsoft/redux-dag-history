import { StateId } from '@essex/redux-dag-history/lib/interfaces'
import * as classnames from 'classnames'
import * as React from 'react'
import DiscoveryTrail from '../DiscoveryTrail'
import { default as Bookmark, IBookmarkProps } from './Bookmark'
import './Bookmark.scss'
import EditBookmark from './EditBookmark'
const { PropTypes } = React

export interface IEditableBookmarkProps extends IBookmarkProps {
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

export interface IEditableBookmarkState {}

const EditableBookmark: React.StatelessComponent<
	IEditableBookmarkProps
> = props => {
	const { editMode, onBookmarkEdit, onBookmarkEditDone } = props
	const innerBookmark = editMode ? (
		<EditBookmark {...props} onDoneEditing={onBookmarkEditDone} />
	) : (
		<Bookmark {...props} onClickEdit={onBookmarkEdit} />
	)

	return <div>{innerBookmark}</div>
}
EditableBookmark.propTypes = {
	index: PropTypes.number,
	name: PropTypes.string.isRequired,
	annotation: PropTypes.string.isRequired,
	numLeadInStates: PropTypes.number,
	active: PropTypes.bool,
	onClick: PropTypes.func,
	onBookmarkChange: PropTypes.func,
	onBookmarkEdit: PropTypes.func,
	onBookmarkEditDone: PropTypes.func,
	onDiscoveryTrailIndexClicked: PropTypes.func,
	shortestCommitPath: PropTypes.arrayOf(PropTypes.string),
	selectedDepth: PropTypes.number,
	onSelectBookmarkDepth: PropTypes.func,
	editMode: PropTypes.bool,
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
