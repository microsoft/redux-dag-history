import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const Flexy = styled.div`
	display: flex;
	flex: 1;
	max-height: 100%;
`

const HistoryContainer = Flexy.extend`
	align-content: space-between;
	flex-direction: column;
	-ms-overflow-style: none;
	overflow: -moz-scrollbars-none;
	overflow: hidden;
	::-webkit-scrollbar {
		display: none;
	}
`

export default HistoryContainer
