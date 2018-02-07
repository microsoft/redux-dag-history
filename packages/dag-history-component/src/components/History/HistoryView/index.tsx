import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { IBookmark } from '../../../interfaces'
import { selectHistoryType } from '../../../state/actions/creators'
import OptionDropdown from '../../OptionDropdown'
import { IHistoryContainerSharedProps } from '../interfaces'
import BranchedHistoryView, {
	IBranchedHistoryViewProps,
} from './BranchedHistoryView'
import ChronologicalHistoryView from './ChronologicalHistoryView'

const BranchedIcon = require('react-icons/lib/go/git-branch')
const ChronologicalIcon = require('react-icons/lib/go/three-bars')

const { PropTypes } = React

const viewLabels = {
	branched: 'Branched',
	chronological: 'Chronological',
}

const viewIcons = {
	branched: <BranchedIcon size={20} />,
	chronological: <ChronologicalIcon size={20} />,
}

export interface IHistoryViewStateProps {}

export interface IHistoryViewDispatchProps {
	onSelectHistoryType: Function
}

export interface IHistoryViewOwnProps extends IHistoryContainerSharedProps {
	bookmarks: IBookmark[]
}

export interface IHistoryViewProps
	extends IHistoryViewStateProps,
		IHistoryViewDispatchProps,
		IHistoryViewOwnProps {}

const HistoryView: React.StatelessComponent<IHistoryViewProps> = props => {
	const { historyType, onSelectHistoryType } = props
	const renderedHistory =
		historyType === 'chronological' ? (
			<ChronologicalHistoryView {...props} />
		) : (
			<BranchedHistoryView {...props} />
		)

	const historyTypeOption = name => ({
		label: viewLabels[name],
		element: (
			<div className="dropdown-option-row">
				<span>{viewLabels[name]}</span>
				{viewIcons[name]}
			</div>
		),
		onClick: () => onSelectHistoryType(name),
	})
	const label = viewLabels[historyType]

	return (
		<div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
				}}
			>
				<OptionDropdown
					triggerClass="history-type-dropdown-trigger"
					label={label}
					icon={viewIcons[historyType]}
					options={[
						historyTypeOption('branched'),
						historyTypeOption('chronological'),
					]}
				/>
			</div>
			{renderedHistory}
		</div>
	)
}
HistoryView.propTypes = {
	historyType: PropTypes.string.isRequired,
	bookmarksEnabled: PropTypes.bool,
	mainView: PropTypes.string.isRequired,
	getSourceFromState: PropTypes.func.isRequired,
	branchContainerExpanded: PropTypes.bool,
	pinnedStateId: PropTypes.string,

	// Redux-injected
	onSelectHistoryType: PropTypes.func,
}

export default connect<
	IHistoryViewStateProps,
	IHistoryViewDispatchProps,
	IHistoryViewOwnProps
>(
	() => ({}),
	dispatch =>
		bindActionCreators(
			{
				onSelectHistoryType: selectHistoryType,
			},
			dispatch,
		),
)(HistoryView)
