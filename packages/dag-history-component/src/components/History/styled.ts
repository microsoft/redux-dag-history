import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'

export const BranchListContainerEl = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 3px;
	max-height: 35%;
	overflow: hidden;
`

export const HistoryControlBarTitle = styled.div`
	font-weight: bold;
	margin-left: 10px;
`

export const HistoryControlBar = styled.div`
	align-items: center;
	cursor: default;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	min-height: 24px;
`

export const DropdownOptionRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

export const ColumnContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`

export const DropdownContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`

/*
%flexy {
  display: flex;
  flex: 1;
  max-height: 100%;
}

.history-view {
  @extend %flexy;
  flex-direction: column;
}

.history-item-container {
  @extend %flexy;
  align-items: stretch;
  flex-direction: column;
  margin-left: 1px;
}

.history-option-menu {
  min-height: 24px;
  position: absolute;
  right: 0;
  top: 0;
}

.history-control-bar {
  align-items: center;
  cursor: default;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 24px;

  .title {
    font-weight: bold;
    margin-left: 10px;
  }
}

.view-options-dropdown {
  display: block;
  right: 0;
}

.history-type-dropdown-trigger {
  margin: 10px;
  display: flex;
  flex-direction: row;
}


.view-select-dropdown {
  display: flex;
  font-weight: bold;
  margin-left: 5px;
}

*/
