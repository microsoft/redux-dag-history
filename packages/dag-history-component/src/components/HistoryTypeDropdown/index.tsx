import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { HistoryType } from '../../interfaces'
import { DropdownOptionRow } from './styled'
import OptionDropdown from '../OptionDropdown'
import { selectHistoryType } from '../../state/actions/creators'

const BranchedIcon = require('react-icons/lib/go/git-branch')
const ChronologicalIcon = require('react-icons/lib/go/three-bars')

const viewLabels: { [key: string]: string } = {
	branched: 'Branched',
	chronological: 'Chronological',
}

const viewIcons: { [key: string]: JSX.Element } = {
	branched: <BranchedIcon size={20} />,
	chronological: <ChronologicalIcon size={20} />,
}

export interface HistoryTypeDropdownOwnProps {
	historyType: HistoryType
}

export interface HistoryTypeDropdownDispatchProps {
	onSelectionChanged: (type: HistoryType) => void
}

export interface HistoryTypeDropdownProps
	extends HistoryTypeDropdownOwnProps,
		HistoryTypeDropdownDispatchProps {}

const historyTypeOption = (
	name: HistoryType,
	onSelectionChanged: (type: HistoryType) => void,
) => ({
	label: viewLabels[name],
	element: (
		<DropdownOptionRow>
			<span>{viewLabels[name]}</span>
			{viewIcons[name]}
		</DropdownOptionRow>
	),
	onClick: () => onSelectionChanged(name),
})

export const HistoryTypeDropdown: React.StatelessComponent<
	HistoryTypeDropdownProps
> = ({ historyType, onSelectionChanged }) => (
	<OptionDropdown
		label={viewLabels[historyType]}
		icon={viewIcons[historyType]}
		options={[
			historyTypeOption(HistoryType.BRANCHED, onSelectionChanged),
			historyTypeOption(HistoryType.CHRONOLOGICAL, onSelectionChanged),
		]}
	/>
)

export default connect<
	{},
	HistoryTypeDropdownDispatchProps,
	HistoryTypeDropdownOwnProps
>(
	() => ({}),
	(dispatch: Dispatch<any>) =>
		bindActionCreators(
			{
				onSelectionChanged: selectHistoryType,
			},
			dispatch,
		),
)(HistoryTypeDropdown)
