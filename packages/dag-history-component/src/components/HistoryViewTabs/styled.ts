import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'
import {
	Tab as TabRaw,
	TabList as TabListRaw,
	TabPanel as TabPanelRaw,
	Tabs as TabsRaw,
	TabProps,
	TabListProps,
	TabPanelProps,
	TabsProps,
} from 'react-tabs'

const Flexy = styled.div`
	display: flex;
	flex: 1;
	max-height: 100%;
`

export const Container = Flexy.extend`
	align-content: space-between;
	flex-direction: column;
	-ms-overflow-style: none;
	overflow: -moz-scrollbars-none;
	overflow: hidden;

	::-webkit-scrollbar {
		display: none;
	}
`

export const Tab = styled(TabRaw)`
	margin: 0 !important;
`

export const TabList = styled(TabListRaw)`
	margin: 0 !important;
`

export const TabPanel = styled(TabPanelRaw)`
	display: flex;
	flex: 1;
	max-height: 100%;
`

export const Tabs = styled(TabsRaw)`
	display: flex;
	flex: 1;
	flex-direction: column;
	max-height: 100%;
`

export const OptionMenu = styled.div`
	min-height: 24px;
	position: absolute;
	right: 0;
	top: 0;
`
