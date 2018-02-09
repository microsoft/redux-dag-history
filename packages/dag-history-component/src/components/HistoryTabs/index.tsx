import * as React from 'react'
import OptionDropdown from '../OptionDropdown'
import { Container, OptionMenu } from './styled'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

const viewNameToIndex: { [key: string]: number } = {
	history: 0,
	storyboarding: 1,
}
const indexToViewName = ['history', 'storyboarding']

function handleTabSelector(onTabSelect: (view: string) => void) {
	return (index: number) => onTabSelect(indexToViewName[index])
}

export interface HistoryContainerProps {
	selectedTab: string
	onTabSelect: (view: string) => void
	historyView: JSX.Element
	storyboardingView: JSX.Element
	bookmarksEnabled?: boolean
	controlBarEnabled?: boolean
	onSaveClicked: Function
	onClearClicked: Function
	onLoadClicked: Function
}

const HistoryContainer: React.StatelessComponent<HistoryContainerProps> = ({
	onTabSelect,
	selectedTab,
	historyView,
	storyboardingView,
	controlBarEnabled,
	bookmarksEnabled,
	onSaveClicked,
	onLoadClicked,
	onClearClicked,
}) => {
	if (!bookmarksEnabled) {
		return historyView
	}
	const controlBar = controlBarEnabled && (
		<OptionMenu>
			<OptionDropdown
				contentClass="view-options-dropdown"
				options={[
					{ label: 'Save', onClick: onSaveClicked },
					{ label: 'Load', onClick: onLoadClicked },
					{ label: 'Clear', onClick: onClearClicked },
				]}
			/>
		</OptionMenu>
	)

	return (
		<Container>
			{controlBar}
			<Tabs
				onSelect={handleTabSelector(onTabSelect)}
				selectedIndex={viewNameToIndex[selectedTab]}
			>
				<TabList>
					<Tab>History</Tab>
					<Tab>Bookmarks</Tab>
				</TabList>
				<TabPanel>{historyView}</TabPanel>
				<TabPanel>{storyboardingView}</TabPanel>
			</Tabs>
		</Container>
	)
}

export default HistoryContainer
