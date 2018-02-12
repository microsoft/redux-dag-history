import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const white = '#fff'
const highlight = '#f93'
const black = '#000'
const charcoal = '#5d6d7e'

export const ContinuationContainer = styled.div`
	overflow: hidden;
	display: flex;
	justify-content: center;
`

export const Container = styled.div`
	font-family: sans-serif;
	align-items: center;
	align-self: stretch;
	border-top: 1px solid $white;
	cursor: pointer;
	display: flex;
	height: 30px;
	min-height: 30px;
	min-width: 250px;
	padding: 8px;
	position: relative;
	overflow: hidden;
	transition: all 250ms ease;

	&.successor {
		margin-left: 35px;
	}

	&:not(:hover) {
		border-right: 3px solid transparent;
	}

	&:hover {
		border-right: 3px solid ${highlight};
	}
`

export const Detail = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin-left: 8px;
	overflow: hidden;
`

export const Source = styled.div`
	font-family: sans-serif;
	font-size: 8pt;
	overflow: hidden;

	&:active {
		color: ${black};
	}

	&:not(.active) {
		color: ${charcoal};
	}
`

export const Name = styled.div`
	font-weight: 300;
	font-size: 11pt;
	white-space: nowrap;
	overflow: hidden;

	&:active {
		color: ${black};
	}

	&:not(.active) {
		color: ${charcoal};
	}
`
