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
	max-height: 100%;
	height: 100%;
`

export const DropdownContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`

export const PlaybackContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	max-height: 100%;
`
