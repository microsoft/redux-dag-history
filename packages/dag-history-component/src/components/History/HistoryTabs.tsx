import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OptionDropdown from '../OptionDropdown';
import './Tabs.scss';

const { PropTypes } = React;

const viewNameToIndex = {
  history: 0,
  storyboarding: 1,
};
const indexToViewName = [
  'history',
  'storyboarding',
];

function handleTabSelector(onTabSelect) {
  return index => onTabSelect(indexToViewName[index]);
}

export interface IHistoryContainerProps {
  selectedTab: string;
  onTabSelect: Function;
  historyView: JSX.Element;
  storyboardingView: JSX.Element;
  bookmarksEnabled?: boolean;
  controlBarEnabled?: boolean;
  onSaveClicked: Function;
  onClearClicked: Function;
  onLoadClicked: Function;
}

const HistoryContainer: React.StatelessComponent<IHistoryContainerProps> = ({
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
    return historyView;
  }
  const controlBar = controlBarEnabled && (
    <div className="history-option-menu">
        <OptionDropdown
          contentClass="view-options-dropdown"
          options={[
            { label: 'Save', onClick: onSaveClicked },
            { label: 'Load', onClick: onLoadClicked },
            { label: 'Clear', onClick: onClearClicked },
          ]}
        />
      </div>
  );

  return (
    <div className="history-container">
      {controlBar}
      <Tabs
        onSelect={handleTabSelector(onTabSelect)}
        selectedIndex={viewNameToIndex[selectedTab]}
      >
        <TabList>
          <Tab>History</Tab>
          <Tab>Bookmarks</Tab>
        </TabList>
        <TabPanel>
          {historyView}
        </TabPanel>
        <TabPanel>
          {storyboardingView}
        </TabPanel>
      </Tabs>
    </div>
  );
}

HistoryContainer.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onTabSelect: PropTypes.func.isRequired,
  historyView: PropTypes.element.isRequired,
  storyboardingView: PropTypes.element.isRequired,
  bookmarksEnabled: PropTypes.bool,
  onSaveClicked: PropTypes.func.isRequired,
  onClearClicked: PropTypes.func.isRequired,
  onLoadClicked: PropTypes.func.isRequired,
};

export default HistoryContainer;
