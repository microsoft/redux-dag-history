
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Bookmark } from '../../../interfaces'
import { selectHistoryType } from '../../../state/actions/creators'
import OptionDropdown from '../../OptionDropdown'
import { HistoryContainerSharedProps } from '../interfaces'
import BranchedHistoryView, {
	BranchedHistoryViewProps,
} from './BranchedHistoryView'
import ChronologicalHistoryView from './ChronologicalHistoryView'

const BranchedIcon = require('react-icons/lib/go/git-branch')
const ChronologicalIcon = require('react-icons/lib/go/three-bars')

const viewLabels = {
	branched: 'Branched',
	chronological: 'Chronological',
}

const viewIcons = {
	branched: <BranchedIcon size={20} />,
	chronological: <ChronologicalIcon size={20} />,
}

export interface HistoryViewStateProps {}

export interface HistoryViewDispatchProps {
	onSelectHistoryType: Function
}

export interface HistoryViewOwnProps extends HistoryContainerSharedProps {
	bookmarks: Bookmark[]
}

export interface HistoryViewProps
	extends HistoryViewStateProps,
		HistoryViewDispatchProps,
		HistoryViewOwnProps {}

const HistoryView: React.StatelessComponent<HistoryViewProps> = props => {
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

export default connect<
	HistoryViewStateProps,
	HistoryViewDispatchProps,
	HistoryViewOwnProps
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
